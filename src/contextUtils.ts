import { Editor, TFile, normalizePath, Notice } from 'obsidian';
import { sentences } from 'sbd';
import TextEaterPlugin from './main';
import { getExisingOrCreatedFileInWorterDir, longDash } from './utils';
import { prompts } from './prompts';
import { createSectionBlock, getSectionSeparator, SECTION_HEADERS } from './sectionHeaders';
import { DictionaryEntry } from './dictionaryEntry';

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

