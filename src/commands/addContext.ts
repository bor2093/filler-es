import { Editor, Notice, TFile } from 'obsidian';
import TextEaterPlugin from '../main';
import { extractSentenceContainingWord, createBlockReference, addContextToFile, findOrCreateDictionaryEntry, isGroundFormWord } from '../contextUtils';
import fillTemplate from './fillTemplate';

export default async function addContext(
	plugin: TextEaterPlugin,
	editor: Editor,
	file: TFile,
	selection: string
) {
	try {
		// Step 1: Clean up nested brackets and wrap properly
		let cleanWord = selection;
		let linkedWord = selection;
		
		// Remove all nested brackets to get the clean word
		while (cleanWord.startsWith('[[') && cleanWord.endsWith(']]')) {
			cleanWord = cleanWord.slice(2, -2);
		}
		
		// Ensure the word is properly wrapped with exactly one layer of brackets
		linkedWord = `[[${cleanWord}]]`;
		
		// Replace the selection with the properly wrapped word
		editor.replaceSelection(linkedWord);
		
		// Step 2: Check if dictionary entry exists, create if needed
		const wordFile = await findOrCreateDictionaryEntry(plugin, cleanWord);
		if (!wordFile) {
			new Notice(`Could not create dictionary entry for: ${selection}`);
			return;
		}
		
		// Step 3: Extract context sentence from the text
		const fullText = editor.getValue();
		const cursorPos = editor.getCursor();
		const cursorOffset = editor.posToOffset(cursorPos);
		const contextSentence = extractSentenceContainingWord(fullText, cleanWord, cursorOffset);
		if (!contextSentence) {
			new Notice(`Could not extract context sentence for: ${selection}`);
			return;
		}

		// Step 4: Add anchor to the sentence in source document
		const blockRef = await createBlockReference(plugin, editor, file, contextSentence);
		if (!blockRef) {
			new Notice(`Could not create block reference for context`);
			return;
		}
        
		// Step 5: Determine if selected word is ground form
		const isGroundForm = await isGroundFormWord(plugin, cleanWord);
		
		// Step 6: Add context to appropriate dictionary entries
		await addContextToFile(plugin, cleanWord, file.basename, blockRef, contextSentence, isGroundForm);
		
		new Notice(`Context added for: ${selection}`);
    
		
	} catch (error) {
		new Notice(`Error adding context: ${error.message}`);
		console.error('Error in addContext:', error);
	}
} 