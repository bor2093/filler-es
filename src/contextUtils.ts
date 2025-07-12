import { Editor, TFile, normalizePath, Notice } from 'obsidian';
import { sentences } from 'sbd';
import TextEaterPlugin from './main';
import { getExisingOrCreatedFileInWorterDir, longDash } from './utils';
import { prompts } from './prompts';
import { createSectionBlock, getSectionSeparator, SECTION_HEADERS } from './sectionHeaders';

/**
 * Extracts the sentence containing the selected word from the full text near the cursor position
 */
export function extractSentenceContainingWord(fullText: string, word: string, cursorOffset?: number): { sentence: string; startIndex: number } | null {
	try {
		const splitSentences = sentences(fullText, {
			preserve_whitespace: false,
			newline_boundaries: true,
			html_boundaries: false,
			sanitize: true,
		});

		// If no cursor position provided, fall back to first occurrence
		if (cursorOffset === undefined) {
			let textPosition = 0;
			for (const sentence of splitSentences) {
				const sentenceIndex = fullText.indexOf(sentence, textPosition);
				// Check if sentence contains the word directly or inside a link
				const containsWord = sentence.toLowerCase().includes(word.toLowerCase()) ||
					// Check for [[word|display]] format
					sentence.toLowerCase().includes(`[[${word.toLowerCase()}|`) ||
					// Check for [[word]] format
					sentence.toLowerCase().includes(`[[${word.toLowerCase()}]]`);
				
				if (containsWord) {
					return { sentence: sentence.trim(), startIndex: sentenceIndex };
				}
				textPosition = sentenceIndex + sentence.length;
			}
			return null;
		}

		// Find sentences that contain the word and their positions in the text
		const candidateSentences: { sentence: string; distance: number; startIndex: number }[] = [];
		let textPosition = 0;

		for (const sentence of splitSentences) {
			const sentenceIndex = fullText.indexOf(sentence, textPosition);
			if (sentenceIndex !== -1) {
				// Check if sentence contains the word directly or inside a link
				const containsWord = sentence.toLowerCase().includes(word.toLowerCase()) ||
					// Check for [[word|display]] format
					sentence.toLowerCase().includes(`[[${word.toLowerCase()}|`) ||
					// Check for [[word]] format
					sentence.toLowerCase().includes(`[[${word.toLowerCase()}]]`);
				
				if (containsWord) {
					// Calculate distance from cursor to the middle of this sentence
					const sentenceMiddle = sentenceIndex + sentence.length / 2;
					const distance = Math.abs(cursorOffset - sentenceMiddle);
					candidateSentences.push({ sentence: sentence.trim(), distance, startIndex: sentenceIndex });
				}
			}
			textPosition = sentenceIndex + sentence.length;
		}

		// Return the sentence closest to the cursor position
		if (candidateSentences.length > 0) {
			candidateSentences.sort((a, b) => a.distance - b.distance);
			
			// Return the sentence with its correct start index
			const selected = candidateSentences[0];
			return { sentence: selected.sentence, startIndex: selected.startIndex };
		}

		return null;
	} catch (error) {
		console.error('Error extracting sentence:', error);
		return null;
	}
}

/**
 * Creates a block reference in the source document for the context sentence
 */
export async function createBlockReference(
	plugin: TextEaterPlugin,
	editor: Editor,
	file: TFile,
	sentence: string,
	sentenceStartIndex?: number
): Promise<string | null> {
	try {
		const fileContent = editor.getValue();
		
		// Use provided sentence index or find the sentence in the text
		let sentenceIndex: number;
		if (sentenceStartIndex !== undefined) {
			sentenceIndex = sentenceStartIndex;
		} else {
			sentenceIndex = fileContent.indexOf(sentence);
			if (sentenceIndex === -1) {
				return null;
			}
		}
		
		// Find the end of the entire block/paragraph that contains this sentence
		// Look for the next empty line or end of file
		let blockEndIndex = sentenceIndex + sentence.length;
		
		// Continue searching for the end of the block
		while (blockEndIndex < fileContent.length) {
			const char = fileContent[blockEndIndex];
			
			// If we hit a double newline (empty line), this is the end of the block
			if (fileContent.substring(blockEndIndex, blockEndIndex + 2) === '\n\n') {
				break;
			}
			
			// If we hit end of file, this is the end of the block
			if (blockEndIndex === fileContent.length - 1) {
				blockEndIndex = fileContent.length;
				break;
			}
			
			blockEndIndex++;
		}
		
		// Check for existing block reference in this block
		const blockContent = fileContent.substring(sentenceIndex, blockEndIndex);
		const existingBlockRefMatch = blockContent.match(/\^(\d+)$/);
		
		// Determine the block reference to use
		let blockRef: string;
		let needToAddBlockRef = false;
		
		if (existingBlockRefMatch) {
			// Reuse existing block reference
			blockRef = existingBlockRefMatch[1];
		} else {
			// Create a new block reference
			const maxContextNumber = plugin.findHighestContextNumber(fileContent);
			const nextNumber = maxContextNumber + 1;
			blockRef = `${nextNumber}`;
			needToAddBlockRef = true;
		}
		
		// Add block reference at the end if it doesn't exist
		if (needToAddBlockRef) {
			// Find the last non-whitespace character in the block
			let lastNonWhitespaceIndex = blockEndIndex - 1;
			while (lastNonWhitespaceIndex > sentenceIndex && /\s/.test(fileContent[lastNonWhitespaceIndex])) {
				lastNonWhitespaceIndex--;
			}
			
			// Calculate positions for block reference at the end
			const startPos = editor.offsetToPos(lastNonWhitespaceIndex + 1);
			const endPos = editor.offsetToPos(blockEndIndex);
			
			// Add block reference at the end
			editor.replaceRange(` ^${blockRef}`, startPos, endPos);
			
			// Force save the editor content to ensure the block reference is persisted
			// This helps prevent race conditions where context entries are created before
			// the block reference is properly indexed by Obsidian
			await plugin.app.vault.modify(file, editor.getValue());
			
		}
		
		return blockRef;
	} catch (error) {
		console.error('Error creating block reference:', error);
		return null;
	}
}

/**
 * Class representing a dictionary entry with methods for reading and writing
 * 
 * @example
 * ```typescript
 * // Create a new dictionary entry
 * const entry = new DictionaryEntry(plugin, 'palabra');
 * 
 * // Find or create the file
 * await entry.findOrCreateFile();
 * 
 * // Add context to the entry
 * await entry.addContext('![[source-file#^123]]');
 * 
 * // Check if entry exists
 * const exists = await entry.exists();
 * 
 * // Get ground form information
 * await entry.determineGroundForm();
 * const isGroundForm = entry.getIsGroundForm();
 * const groundForm = entry.getGroundForm();
 * 
 * // Regenerate content
 * await entry.regenerate();
 * 
 * // Static factory method
 * const entry2 = await DictionaryEntry.create(plugin, 'otra-palabra');
 * ```
 */
export class DictionaryEntry {
	private plugin: TextEaterPlugin;
	private word: string;
	private file: TFile | null = null;
	private content: string = '';
	private isGroundForm: boolean = false;
	private groundForm: string | null = null;

	constructor(plugin: TextEaterPlugin, word: string) {
		this.plugin = plugin;
		this.word = word;
	}

	/**
	 * Finds or creates the dictionary entry file
	 */
	async findOrCreateFile(): Promise<TFile | null> {
		try {
			// Try to find existing file
			const existingFile = await getExisingOrCreatedFileInWorterDir(
				this.plugin.app.vault,
				{ name: this.word, path: null },
				this.plugin.settings.useShardedFileStructure,
				this.plugin.settings.dictionaryFolderPath
			);
			
			if (existingFile) {
				this.file = existingFile;
				// Check if file has content (is a proper dictionary entry)
				const content = await this.plugin.app.vault.read(existingFile);
				if (content.trim().length > 0) {
					this.content = content;
					return existingFile;
				}
			}
			
			// Create new dictionary entry
			const newFile = existingFile || await getExisingOrCreatedFileInWorterDir(
				this.plugin.app.vault,
				{ name: this.word, path: null },
				this.plugin.settings.useShardedFileStructure,
				this.plugin.settings.dictionaryFolderPath
			);
			
			if (newFile) {
				this.file = newFile;
				// Check if file is empty and needs dictionary entry generation
				const content = await this.plugin.app.vault.read(newFile);
				if (content.trim().length === 0) {
					// Generate full dictionary entry automatically
					await this.generateContent();
				} else {
					this.content = content;
				}
			}
			
			return newFile;
		} catch (error) {
			console.error('Error finding/creating dictionary entry:', error);
			return null;
		}
	}

	/**
	 * Reads the dictionary entry from file
	 */
	async readFromFile(): Promise<string> {
		if (!this.file) {
			throw new Error('No file associated with this dictionary entry');
		}
		
		try {
			this.content = await this.plugin.app.vault.read(this.file);
			return this.content;
		} catch (error) {
			console.error('Error reading dictionary entry:', error);
			throw error;
		}
	}

	/**
	 * Writes the dictionary entry to file
	 */
	async writeToFile(content?: string): Promise<void> {
		if (!this.file) {
			throw new Error('No file associated with this dictionary entry');
		}
		
		try {
			const contentToWrite = content || this.content;
			await this.plugin.app.vault.modify(this.file, contentToWrite);
			this.content = contentToWrite;
		} catch (error) {
			console.error('Error writing dictionary entry:', error);
			throw error;
		}
	}

	/**
	 * Determines if the word is in its ground form
	 */
	async determineGroundForm(): Promise<void> {
		try {
			const response = await this.plugin.apiService.determineInfinitiveAndEmoji(this.word);
			if (!response) {
				this.isGroundForm = false;
				return;
			}
			
			// Extract the canonical form from the response
			const canonicalMatch = response.match(/\[\[([^\]]+)\]\]/);
			if (!canonicalMatch) {
				this.isGroundForm = false;
				return;
			}
			
			const canonicalForm = canonicalMatch[1];
			this.groundForm = canonicalForm;
			this.isGroundForm = this.word.toLowerCase() === canonicalForm.toLowerCase();
		} catch (error) {
			console.error('Error determining ground form:', error);
			this.isGroundForm = false;
		}
	}

	/**
	 * Generates full dictionary entry content
	 */
	async generateContent(): Promise<void> {
		try {
			// Determine ground form first
			await this.determineGroundForm();
			
			// Generate all content in parallel
			const [dictionaryEntry, froms, morphems, valence] = await Promise.all([
				this.plugin.apiService.generateContent(prompts.generate_dictionary_entry, this.word),
				this.plugin.apiService.generateContent(prompts.generate_forms, this.word),
				this.plugin.apiService.generateContent(prompts.morphems, this.word),
				this.plugin.apiService.generateContent(prompts.generate_valence_block, this.word),
			]);

			// Process and combine content
			const processedContent = this.processGeneratedContent(dictionaryEntry, froms, morphems, valence);
			this.content = processedContent;
			
			// Write to file
			await this.writeToFile();
		} catch (error) {
			console.error('Error generating dictionary entry:', error);
			// Fallback to placeholder if generation fails
			this.content = `# ${this.word}\n\n*Dictionary entry generation failed. Please run the Fill Template command manually.*`;
			await this.writeToFile();
		}
	}

	/**
	 * Processes generated content and formats it properly
	 */
	private processGeneratedContent(dictionaryEntry: string, froms: string, morphems: string, valence: string): string {
		// Extract adjective forms
		const adjForms = this.extractAdjectiveForms(froms);
		const trimmedBaseEntrie = this.cleanAITags(dictionaryEntry);

		// Split content to insert tags after header
		const lines = trimmedBaseEntrie.split('\n');
		const headerLine = lines[0];
		const restOfContent = lines.slice(1).join('\n');
		
		// Add tags right after header
		const tags = this.createTags(this.word, trimmedBaseEntrie, this.isGroundForm);
		const contentWithTags = `${headerLine}\n\n${tags}\n\n${restOfContent}`;
		
		const baseBlock = this.insertYouglishLinkInIpa(contentWithTags);
		const morphemsBlock = createSectionBlock('MORFEMAS', this.cleanAITags(morphems), longDash);
		const valenceBlock = createSectionBlock('VALENCIA', this.cleanAITags(valence), longDash);
		
		// Add conjugation link to Formas Gramaticales for verbs
		let formasContent = this.cleanAITags(froms);
		if (this.isVerb(trimmedBaseEntrie) && formasContent !== longDash) {
			formasContent += `\n\n${this.createConjugationLink(this.word)}`;
		}
		const fromsBlock = createSectionBlock('FORMAS_GRAMATICALES', formasContent, longDash);
		
		const adjFormsBlock = createSectionBlock('FORMAS_ADJETIVALES', this.cleanAITags(adjForms), longDash);
		const enlacesEntrantesBlock = createSectionBlock('ENLACES_ENTRANTES', this.createDataviewQuery(this.word), longDash);
		// Always create Context section (even if empty) so that context can be added later
		const contextoBlock = `${SECTION_HEADERS.CONTEXTO}\n`;

		const blocks = [
			baseBlock,
			morphemsBlock,
			valenceBlock,
			fromsBlock,
			adjFormsBlock,
			enlacesEntrantesBlock,
			contextoBlock,
		];

		if (this.isGroundForm) {
			// Ground form - return the full entry
			return this.joinBlocksWithProperSpacing(blocks, getSectionSeparator());
		} else {
			// Non-ground form - create minimal entry with tags, link to ground form, incoming links, and context
			const derivedTags = this.createTags(this.word, trimmedBaseEntrie, false);
			const derivedEnlacesEntrantesBlock = createSectionBlock('ENLACES_ENTRANTES', this.createDataviewQuery(this.word), longDash);
			const derivedContextoBlock = `${SECTION_HEADERS.CONTEXTO}\n`;
			
			// Use the ground form if found, otherwise fallback to the word itself
			const groundFormLink = this.groundForm ? `[[${this.groundForm}]]` : `*Ground form not found*`;
			return `${groundFormLink}\n\n${derivedTags}\n\n${getSectionSeparator()}\n\n${derivedEnlacesEntrantesBlock}\n\n${getSectionSeparator()}\n\n${derivedContextoBlock}`;
		}
	}

	/**
	 * Adds context entry to the dictionary file
	 */
	async addContext(contextEntry: string): Promise<void> {
		try {
			// Ensure content is loaded
			if (!this.content && this.file) {
				await this.readFromFile();
			}
			
			// Find the Context section
			let contextSectionIndex = this.content.lastIndexOf('### Contexto');
			
			if (contextSectionIndex === -1) {
				// If file is empty or missing Context section, regenerate the dictionary entry
				if (this.content.trim().length === 0) {
					await this.generateContent();
					contextSectionIndex = this.content.lastIndexOf('### Contexto');
				} else {
					// File has content but no Context section - add it at the end
					const contextSection = `\n\n### Contexto\n`;
					this.content = this.content + contextSection;
					await this.writeToFile();
					contextSectionIndex = this.content.lastIndexOf('### Contexto');
				}
				
				// If we still don't have a Context section, something is wrong
				if (contextSectionIndex === -1) {
					console.error(`Failed to create Context section for word: ${this.word}`);
					return;
				}
			}
			
			// Find the end of the Context section (or end of file)
			let insertionPoint = this.content.length;
			const afterContextSection = this.content.substring(contextSectionIndex);
			const nextSectionMatch = afterContextSection.match(/\n### /);
			
			if (nextSectionMatch) {
				insertionPoint = contextSectionIndex + nextSectionMatch.index!;
			}
			
			// Create the new context entry with bullet point
			const bulletEntry = `${contextEntry}\n`;
			
			// Find where the Context header ends to check for existing content
			const contextHeaderLine = this.content.indexOf('### Contexto');
			const contextHeaderEnd = this.content.indexOf('\n', contextHeaderLine) + 1;
			
			// Check if there's already content in the Context section
			const contextSectionContent = this.content.substring(contextHeaderEnd, insertionPoint);
			const hasExistingContent = contextSectionContent.trim().length > 0;
			
			// Insert the new context entry at the end of the Context section
			const beforeInsertion = this.content.substring(0, insertionPoint);
			const afterInsertion = this.content.substring(insertionPoint);
			
			// Add the context entry with proper spacing
			this.content = `${beforeInsertion}${hasExistingContent ? '\n' : ''}${bulletEntry}\n${afterInsertion}`;
			
			// Write back to file
			await this.writeToFile();
		} catch (error) {
			new Notice(`[ERROR] Error in addContext: ${error.message}`);
			console.error('Error adding context to dictionary entry:', error);
		}
	}

	// Helper methods (extracted from the original generateDictionaryEntry function)
	private cleanAITags(content: string): string {
		return content
			.replace(/<agent_output>/g, '')
			.replace(/<\/agent_output>/g, '')
			.replace(/^<agent_output>/, '')
			.replace(/<\/agent_output>$/, '')
			.trim();
	}

	private extractFirstBracketedWord(text: string): string | null {
		const match = text.match(/\[\[([^\]]+)\]\]/);
		return match ? match[1] : null;
	}

	private determinePartOfSpeech(content: string): string {
		if (content.includes('→') && content.includes('haber') && content.includes('[[')) {
			return 'verbo';
		}
		if (content.includes('🔴') || content.includes('🔵') || 
			content.includes('el [[') || content.includes('la [[') ||
			content.includes('los [[') || content.includes('las [[')) {
			return 'sustantivo';
		}
		if (content.includes('más [[') || content.includes('menos [[') ||
			content.includes('comparative') || content.includes('superlative') ||
			(content.includes('≠') && !content.includes('→'))) {
			return 'adjetivo';
		}
		if (content.includes('mente]]') || content.includes('adverbio') || 
			content.includes('aquí') || content.includes('allí')) {
			return 'adverbio';
		}
		return 'desconocido';
	}

	private createTags(fileName: string, content: string, isGroundForm: boolean): string {
		const partOfSpeech = this.determinePartOfSpeech(content);
		const groundFormStatus = isGroundForm ? 'forma-base' : 'forma-derivada';
		return `#${groundFormStatus} #${partOfSpeech}`;
	}

	private isVerb(content: string): boolean {
		return (
			content.includes('→') &&
			content.includes('haber') &&
			content.includes('[[')
		) || content.includes('Infinitivo') || content.includes('Participio');
	}

	private createConjugationLink(word: string): string {
		return `**Conjugación**: [elconjugador.com](https://www.elconjugador.com/conjugacion/verbo/${word}.html)`;
	}

	private extractAdjectiveForms(text: string): string {
		const match = text.match(/Adjetivos:\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\]/);
		if (!match) return longDash;

		const [_, base, comparative, superlative] = match;
		const endings = ['o', 'a', 'os', 'as'];
		const result: string[] = [];

		for (const suf of [base, comparative, superlative]) {
			for (const end of endings) {
				result.push(`[[${suf + end}]]`);
			}
		}
		return result.join(', ');
	}

	private createDataviewQuery(word: string): string {
		return `\`\`\`dataview
LIST FROM [[]]
WHERE (file.name != this.file.name)
SORT file.ctime ASC
\`\`\``;
	}

	private insertYouglishLinkInIpa(baseBlock: string): string {
		const regex = /\[(?!\[)(.*?)(?<!\])\]/g;
		const matches = [];
		let match;

		while ((match = regex.exec(baseBlock)) !== null) {
			if (match.index === 0 || baseBlock[match.index - 1] !== '[') {
				matches.push([match.index, regex.lastIndex - 1]);
			}
		}

		const ipaI = matches.length ? matches[0] : null;
		const wordMatch = baseBlock.match(/\[\[([^\]]+)\]\]/);
		const wordFromBlock = wordMatch ? wordMatch[1] : null;

		if (!ipaI || !wordFromBlock) {
			return baseBlock;
		}

		const ipa1 = ipaI[1];
		if (!ipa1) {
			return baseBlock;
		}

		return (
			baseBlock.slice(0, ipa1 + 1) +
			`(https://youglish.com/pronounce/${wordFromBlock}/spanish)` +
			baseBlock.slice(ipa1 + 1)
		);
	}

	private joinBlocksWithProperSpacing(blocks: string[], separator: string): string {
		const cleanBlocks = blocks
			.filter(Boolean)
			.map(block => block.trim());
		
		return cleanBlocks.join(`\n\n${separator}\n`);
	}

	// Getters
	getWord(): string {
		return this.word;
	}

	getFile(): TFile | null {
		return this.file;
	}

	getContent(): string {
		return this.content;
	}

	getIsGroundForm(): boolean {
		return this.isGroundForm;
	}

	getGroundForm(): string | null {
		return this.groundForm;
	}

	/**
	 * Creates a new DictionaryEntry instance and automatically finds/creates the file
	 */
	static async create(plugin: TextEaterPlugin, word: string): Promise<DictionaryEntry> {
		const entry = new DictionaryEntry(plugin, word);
		await entry.findOrCreateFile();
		return entry;
	}

	/**
	 * Checks if the dictionary entry exists and has content
	 */
	async exists(): Promise<boolean> {
		if (!this.file) {
			await this.findOrCreateFile();
		}
		return this.file !== null && this.content.trim().length > 0;
	}

	/**
	 * Regenerates the dictionary entry content
	 */
	async regenerate(): Promise<void> {
		await this.generateContent();
	}

	/**
	 * Gets the file path of the dictionary entry
	 */
	getFilePath(): string | null {
		return this.file?.path || null;
	}
}

/**
 * Finds or creates a dictionary entry for the given word (legacy function for backward compatibility)
 */
export async function findOrCreateDictionaryEntry(
	plugin: TextEaterPlugin,
	word: string
): Promise<TFile | null> {
	const dictionaryEntry = new DictionaryEntry(plugin, word);
	return await dictionaryEntry.findOrCreateFile();
}

/**
 * Determines if a word is in its ground form by checking with AI
 */
export async function isGroundFormWord(plugin: TextEaterPlugin, word: string): Promise<boolean> {
	const dictionaryEntry = new DictionaryEntry(plugin, word);
	await dictionaryEntry.determineGroundForm();
	return dictionaryEntry.getIsGroundForm();
}

/**
 * Adds context entry to the appropriate dictionary files
 */
export async function addContextToFile(
	plugin: TextEaterPlugin,
	selectedWord: string,
	sourceFileName: string,
	blockRef: string,
	isGroundForm: boolean
): Promise<void> {
	try {		
		// Create context entry
		const contextEntry = `![[${sourceFileName}#^${blockRef}]]`;
		
		// Add to the selected word's file
		const selectedWordEntry = new DictionaryEntry(plugin, selectedWord);
		await selectedWordEntry.findOrCreateFile();
		await selectedWordEntry.addContext(contextEntry);
		
		// If not ground form, also add to ground form file
		if (!isGroundForm) {
			// Get ground form
			const groundForm = selectedWordEntry.getGroundForm() || await getGroundForm(plugin, selectedWord);
			if (groundForm && groundForm !== selectedWord) {
				// Ensure ground form dictionary entry exists and add context
				const groundFormEntry = new DictionaryEntry(plugin, groundForm);
				await groundFormEntry.findOrCreateFile();
				await groundFormEntry.addContext(contextEntry);
			}
		}
	} catch (error) {
		new Notice(`[ERROR] Error in addContextToFile: ${error.message}`);
		console.error('Error adding context to file:', error);
	}
}

/**
 * Gets the ground form of a word
 */
async function getGroundForm(plugin: TextEaterPlugin, word: string): Promise<string | null> {
	const dictionaryEntry = new DictionaryEntry(plugin, word);
	await dictionaryEntry.determineGroundForm();
	return dictionaryEntry.getGroundForm();
}

