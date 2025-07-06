import { Editor, TFile, normalizePath, Notice } from 'obsidian';
import { sentences } from 'sbd';
import TextEaterPlugin from './main';
import { getExisingOrCreatedFileInWorterDir, longDash } from './utils';
import { prompts } from './prompts';
import { createSectionBlock, getSectionSeparator, SECTION_HEADERS } from './sectionHeaders';

/**
 * Extracts the sentence containing the selected word from the full text near the cursor position
 */
export function extractSentenceContainingWord(fullText: string, word: string, cursorOffset?: number): string | null {
	try {
		const splitSentences = sentences(fullText, {
			preserve_whitespace: false,
			newline_boundaries: true,
			html_boundaries: false,
			sanitize: true,
		});

		// If no cursor position provided, fall back to first occurrence
		if (cursorOffset === undefined) {
			for (const sentence of splitSentences) {
				if (sentence.toLowerCase().includes(word.toLowerCase())) {
					return sentence.trim();
				}
			}
			return null;
		}

		// Find sentences that contain the word and their positions in the text
		const candidateSentences: { sentence: string; distance: number }[] = [];
		let textPosition = 0;

		for (const sentence of splitSentences) {
			const sentenceIndex = fullText.indexOf(sentence, textPosition);
			if (sentenceIndex !== -1 && sentence.toLowerCase().includes(word.toLowerCase())) {
				// Calculate distance from cursor to the middle of this sentence
				const sentenceMiddle = sentenceIndex + sentence.length / 2;
				const distance = Math.abs(cursorOffset - sentenceMiddle);
				candidateSentences.push({ sentence: sentence.trim(), distance });
			}
			textPosition = sentenceIndex + sentence.length;
		}

		// Return the sentence closest to the cursor position
		if (candidateSentences.length > 0) {
			candidateSentences.sort((a, b) => a.distance - b.distance);
			return candidateSentences[0].sentence;
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
	sentence: string
): Promise<string | null> {
	try {
		const fileContent = editor.getValue();
		
		// Find the sentence in the text
		const sentenceIndex = fileContent.indexOf(sentence);
		if (sentenceIndex === -1) {
			return null;
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
		
		// Check if there's already a block reference at the end of this block
		const blockContent = fileContent.substring(sentenceIndex, blockEndIndex);
		const existingBlockRefMatch = blockContent.match(/\^(context\d+)$/);
		
		if (existingBlockRefMatch) {
			// Reuse existing block reference
			return existingBlockRefMatch[1];
		}
		
		// No existing block reference, create a new one
		const maxContextNumber = plugin.findHighestContextNumber(fileContent);
		const nextNumber = maxContextNumber + 1;
		const blockRef = `context${nextNumber}`;
		
		// Find the last non-whitespace character in the block
		let lastNonWhitespaceIndex = blockEndIndex - 1;
		while (lastNonWhitespaceIndex > sentenceIndex && /\s/.test(fileContent[lastNonWhitespaceIndex])) {
			lastNonWhitespaceIndex--;
		}
		
		// Calculate positions for replacement
		const startPos = editor.offsetToPos(lastNonWhitespaceIndex + 1);
		const endPos = editor.offsetToPos(blockEndIndex);
		
		// Replace all trailing whitespace with exactly one space + block reference
		editor.replaceRange(` ^${blockRef}`, startPos, endPos);
		
		return blockRef;
	} catch (error) {
		console.error('Error creating block reference:', error);
		return null;
	}
}

/**
 * Finds or creates a dictionary entry for the given word
 */
export async function findOrCreateDictionaryEntry(
	plugin: TextEaterPlugin,
	word: string
): Promise<TFile | null> {
	try {
		// Try to find existing file
		const existingFile = await getExisingOrCreatedFileInWorterDir(
			plugin.app.vault,
			{ name: word, path: null },
			plugin.settings.useShardedFileStructure,
			plugin.settings.dictionaryFolderPath
		);
		
		if (existingFile) {
			// Check if file has content (is a proper dictionary entry)
			const content = await plugin.app.vault.read(existingFile);
			if (content.trim().length > 0) {
				return existingFile;
			}
		}
		
		// Create new dictionary entry
		const newFile = existingFile || await getExisingOrCreatedFileInWorterDir(
			plugin.app.vault,
			{ name: word, path: null },
			plugin.settings.useShardedFileStructure,
			plugin.settings.dictionaryFolderPath
		);
		
		if (newFile) {
			// Check if file is empty and needs dictionary entry generation
			const content = await plugin.app.vault.read(newFile);
			if (content.trim().length === 0) {
				// Generate full dictionary entry automatically
				await generateDictionaryEntry(plugin, newFile, word);
			}
		}
		
		return newFile;
	} catch (error) {
		console.error('Error finding/creating dictionary entry:', error);
		return null;
	}
}

/**
 * Determines if a word is in its ground form by checking with AI
 */
export async function isGroundFormWord(plugin: TextEaterPlugin, word: string): Promise<boolean> {
	try {
		// Use the existing infinitive detection logic
		const response = await plugin.apiService.determineInfinitiveAndEmoji(word);
		if (!response) return false;
		
		// Extract the canonical form from the response
		const canonicalMatch = response.match(/\[\[([^\]]+)\]\]/);
		if (!canonicalMatch) return false;
		
		const canonicalForm = canonicalMatch[1];
		return word.toLowerCase() === canonicalForm.toLowerCase();
	} catch (error) {
		console.error('Error determining ground form:', error);
		return false;
	}
}

/**
 * Adds context entry to the appropriate dictionary files
 */
export async function addContextToFile(
	plugin: TextEaterPlugin,
	selectedWord: string,
	sourceFileName: string,
	blockRef: string,
	contextSentence: string,
	isGroundForm: boolean
): Promise<void> {
	try {
		const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
		
		// Create context entry
		const contextEntry = `**[[${sourceFileName}#^${blockRef}|📍]]** (${currentDate}): "${contextSentence}"`;
		
		// Add to the selected word's file
		await appendContextToFile(plugin, selectedWord, contextEntry);
		
		// If not ground form, also add to ground form file
		if (!isGroundForm) {
			// Get ground form
			const groundForm = await getGroundForm(plugin, selectedWord);
			if (groundForm && groundForm !== selectedWord) {
				await appendContextToFile(plugin, groundForm, contextEntry);
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
	try {
		const response = await plugin.apiService.determineInfinitiveAndEmoji(word);
		if (!response) return null;
		
		const canonicalMatch = response.match(/\[\[([^\]]+)\]\]/);
		return canonicalMatch ? canonicalMatch[1] : null;
	} catch (error) {
		console.error('Error getting ground form:', error);
		return null;
	}
}

/**
 * Appends context entry to a dictionary file's Context section
 */
async function appendContextToFile(
	plugin: TextEaterPlugin,
	word: string,
	contextEntry: string
): Promise<void> {
	try {
		// Find the word's file
		const wordFile = await getExisingOrCreatedFileInWorterDir(
			plugin.app.vault,
			{ name: word, path: null },
			plugin.settings.useShardedFileStructure,
			plugin.settings.dictionaryFolderPath
		);
		
		if (!wordFile) {
			console.log(`No file found for word: ${word}`);
			return;
		}
		
		// Read current content
		const content = await plugin.app.vault.read(wordFile);
		console.log(`File content for ${word}:`, content.substring(0, 200) + '...');
		
		// Find the Context section
		const contextSectionIndex = content.lastIndexOf('### Contexto');
		if (contextSectionIndex === -1) {
			console.log(`No Context section found in file for word: ${word}`);
			return;
		}
		
		console.log(`Found Context section at index: ${contextSectionIndex}`);
		
		// Find the end of the Context section (or end of file)
		let insertionPoint = content.length;
		const afterContextSection = content.substring(contextSectionIndex);
		const nextSectionMatch = afterContextSection.match(/\n### /);
		
		if (nextSectionMatch) {
			insertionPoint = contextSectionIndex + nextSectionMatch.index!;
		}
		
		// Count existing context entries to determine the next number
		const contextContent = content.substring(contextSectionIndex, insertionPoint);
		const existingEntries = contextContent.match(/^\d+\. \*\*/gm) || [];
		const nextNumber = existingEntries.length + 1;
		
		console.log(`Context content: "${contextContent}"`);
		console.log(`Existing entries: ${existingEntries.length}, Next number: ${nextNumber}`);
		
		// Create the new context entry with numbering
		const numberedEntry = `${nextNumber}. ${contextEntry}`;
		console.log(`Numbered entry: "${numberedEntry}"`);
		
		// Find where the Context header ends to check for existing content
		const contextHeaderLine = content.indexOf('### Contexto');
		const contextHeaderEnd = content.indexOf('\n', contextHeaderLine) + 1;
		
		// Check if there's already content in the Context section
		const contextSectionContent = content.substring(contextHeaderEnd, insertionPoint);
		const hasExistingContent = contextSectionContent.trim().length > 0;
		
		console.log(`Context section content: "${contextSectionContent}"`);
		console.log(`Has existing content: ${hasExistingContent}`);
		
		// Insert the new context entry at the end of the Context section
		const beforeInsertion = content.substring(0, insertionPoint);
		const afterInsertion = content.substring(insertionPoint);
		
		// Add the context entry with proper spacing
		const updatedContent = `${beforeInsertion}${hasExistingContent ? '\n' : ''}${numberedEntry}\n${afterInsertion}`;
		
		console.log(`Updated content preview: "${updatedContent.substring(Math.max(0, insertionPoint - 50), insertionPoint + 100)}"`);
		
		// Write back to file
		await plugin.app.vault.modify(wordFile, updatedContent);
	} catch (error) {
		new Notice(`[ERROR] Error in appendContextToFile: ${error.message}`);
		console.error('Error appending context to file:', error);
	}
}

/**
 * Generates a full dictionary entry for a new file
 */
async function generateDictionaryEntry(
	plugin: TextEaterPlugin,
	file: TFile,
	word: string
): Promise<void> {
	try {
		// Generate all content in parallel (same as fillTemplate)
		const [dictionaryEntry, froms, morphems, valence] = await Promise.all([
			plugin.apiService.generateContent(prompts.generate_dictionary_entry, word),
			plugin.apiService.generateContent(prompts.generate_forms, word),
			plugin.apiService.generateContent(prompts.morphems, word),
			plugin.apiService.generateContent(prompts.generate_valence_block, word),
		]);

		// Helper functions from fillTemplate
		const cleanAITags = (content: string): string => {
			return content
				.replace(/<agent_output>/g, '')
				.replace(/<\/agent_output>/g, '')
				.replace(/^<agent_output>/, '')
				.replace(/<\/agent_output>$/, '')
				.trim();
		};

		const extractFirstBracketedWord = (text: string): string | null => {
			const match = text.match(/\[\[([^\]]+)\]\]/);
			return match ? match[1] : null;
		};

		const determinePartOfSpeech = (content: string): string => {
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
		};

		const createTags = (fileName: string, content: string, isGroundForm: boolean): string => {
			const partOfSpeech = determinePartOfSpeech(content);
			const groundFormStatus = isGroundForm ? 'forma-base' : 'forma-derivada';
			return `#${groundFormStatus} #${partOfSpeech}`;
		};

		const isVerb = (content: string): boolean => {
			return (
				content.includes('→') &&
				content.includes('haber') &&
				content.includes('[[')
			) || content.includes('Infinitivo') || content.includes('Participio');
		};

		const createConjugationLink = (word: string): string => {
			return `**Conjugación**: [elconjugador.com](https://www.elconjugador.com/conjugacion/verbo/${word}.html)`;
		};

		const extractAdjectiveForms = (text: string): string => {
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
		};

		const createDataviewQuery = (word: string): string => {
			return `\`\`\`dataview
LIST FROM [[]]
WHERE (file.name != this.file.name)
SORT file.ctime ASC
\`\`\``;
		};

		const incertYouglishLinkInIpa = (baseBlock: string): string => {
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
		};

		const joinBlocksWithProperSpacing = (blocks: string[], separator: string): string => {
			const cleanBlocks = blocks
				.filter(Boolean)
				.map(block => block.trim());
			
			return cleanBlocks.join(`\n\n${separator}\n`);
		};

		// Process content (same logic as fillTemplate)
		const adjForms = extractAdjectiveForms(froms);
		const trimmedBaseEntrie = cleanAITags(dictionaryEntry);

		// Split content to insert tags after header
		const lines = trimmedBaseEntrie.split('\n');
		const headerLine = lines[0];
		const restOfContent = lines.slice(1).join('\n');
		
		const normalForm = extractFirstBracketedWord(trimmedBaseEntrie);
		const isGroundForm = normalForm?.toLowerCase() === word.toLowerCase();
		
		// Add tags right after header
		const tags = createTags(word, trimmedBaseEntrie, isGroundForm);
		const contentWithTags = `${headerLine}\n\n${tags}\n\n${restOfContent}`;
		
		const baseBlock = incertYouglishLinkInIpa(contentWithTags);
		const morphemsBlock = createSectionBlock('MORFEMAS', cleanAITags(morphems), longDash);
		const valenceBlock = createSectionBlock('VALENCIA', cleanAITags(valence), longDash);
		
		// Add conjugation link to Formas Gramaticales for verbs
		let formasContent = cleanAITags(froms);
		if (isVerb(trimmedBaseEntrie) && formasContent !== longDash) {
			formasContent += `\n\n${createConjugationLink(word)}`;
		}
		const fromsBlock = createSectionBlock('FORMAS_GRAMATICALES', formasContent, longDash);
		
		const adjFormsBlock = createSectionBlock('FORMAS_ADJETIVALES', cleanAITags(adjForms), longDash);
		const enlacesEntrantesBlock = createSectionBlock('ENLACES_ENTRANTES', createDataviewQuery(word), longDash);
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
		const entrie = joinBlocksWithProperSpacing(blocks, getSectionSeparator());

		if (isGroundForm) {
			// Ground form - write the full entry
			await plugin.app.vault.modify(file, entrie);
		} else {
			// Non-ground form - create minimal entry with tags, link to ground form, incoming links, and context
			const derivedTags = createTags(word, trimmedBaseEntrie, false);
			const derivedEnlacesEntrantesBlock = createSectionBlock('ENLACES_ENTRANTES', createDataviewQuery(word), longDash);
			const derivedContextoBlock = `${SECTION_HEADERS.CONTEXTO}\n`;
			
			const derivedEntry = `[[${normalForm}]]\n\n${derivedTags}\n\n${getSectionSeparator()}\n\n${derivedEnlacesEntrantesBlock}\n\n${getSectionSeparator()}\n\n${derivedContextoBlock}`;
			
			await plugin.app.vault.modify(file, derivedEntry);
		}
	} catch (error) {
		console.error('Error generating dictionary entry:', error);
		// Fallback to placeholder if generation fails
		await plugin.app.vault.modify(file, `# ${word}\n\n*Dictionary entry generation failed. Please run the Fill Template command manually.*`);
	}
} 