import { Editor, MarkdownView, Notice, TFile } from 'obsidian';
import TextEaterPlugin from '../main';
import { DictionaryEntry } from '../dictionaryEntry';

export default async function fillTemplate(
	plugin: TextEaterPlugin,
	editor: Editor,
	file: TFile,
	callBack?: () => void
) {
	const word = file.basename;

	try {
		// Create dictionary entry instance and generate content
		const entryInstance = new DictionaryEntry(plugin, word, file);
		await entryInstance.generateContent();
	} catch (error) {
		new Notice(`Error: ${error.message}`);
	}
}


