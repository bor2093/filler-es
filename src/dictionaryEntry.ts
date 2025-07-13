import { Notice, TFile } from 'obsidian';
import TextEaterPlugin from './main';
import { getExisingOrCreatedFileInWorterDir, longDash } from './utils';
import { prompts } from './prompts';
import { createSectionBlock, getSectionSeparator, SECTION_HEADERS } from './sectionHeaders';

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


	constructor(plugin: TextEaterPlugin, word: string, file: TFile | null = null) {
		this.plugin = plugin;
		this.word = word;
		this.file = file;
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
	 * Adds context entry to the dictionary file and optionally to the ground form file
	 */
	async addContext(contextEntry: string): Promise<void> {
		try {
			// Add context to the current word's dictionary entry
			await this.addContextToCurrentEntry(contextEntry);
			
			// If this is not a ground form, also add context to the ground form entry
			if (!this.isGroundForm && this.groundForm && this.groundForm !== this.word) {
				const groundFormEntry = new DictionaryEntry(this.plugin, this.groundForm);
				await groundFormEntry.findOrCreateFile();
				await groundFormEntry.addContextToCurrentEntry(contextEntry);
			}
		} catch (error) {
			new Notice(`[ERROR] Error in addContext: ${error.message}`);
			console.error('Error adding context to dictionary entry:', error);
		}
	}

	/**
	 * Adds context entry to the current dictionary file only
	 */
	private async addContextToCurrentEntry(contextEntry: string): Promise<void> {
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
			console.error('Error adding context to current dictionary entry:', error);
			throw error;
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

	private getIPAIndexes(str: string): [number, number] | null {
		const regex = /\[(?!\[)(.*?)(?<!\])\]/g;
		const matches: [number, number][] = [];
		let match;

		while ((match = regex.exec(str)) !== null) {
			if (match.index === 0 || str[match.index - 1] !== '[') {
				matches.push([match.index, regex.lastIndex - 1]);
			}
		}

		return matches.length ? matches[0] : null;
	}

	private extractBaseForms(text: string): string[] | null {
		const match = text.match(
			/Adjetivos:\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\]/
		);
		if (!match) {
			return null;
		}

		const [_, base, comparative, superlative] = match;
		return [base, comparative, superlative];
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