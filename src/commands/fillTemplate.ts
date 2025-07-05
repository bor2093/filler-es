import { Editor, MarkdownView, Notice, TFile } from 'obsidian';
import TextEaterPlugin from '../main';
import { prompts } from '../prompts';
import { longDash } from '../utils';
import { createSectionBlock, SECTION_HEADERS, getSectionSeparator } from '../sectionHeaders';

function extractFirstBracketedWord(text: string) {
	const match = text.match(/\[\[([^\]]+)\]\]/);
	return match ? match[1] : null;
}

function getIPAIndexes(str: string) {
	const regex = /\[(?!\[)(.*?)(?<!\])\]/g;
	const matches = [];
	let match;

	while ((match = regex.exec(str)) !== null) {
		if (match.index === 0 || str[match.index - 1] !== '[') {
			matches.push([match.index, regex.lastIndex - 1]);
		}
	}

	return matches.length ? matches[0] : null;
}

function incertYouglishLinkInIpa(baseBlock: string) {
	const ipaI = getIPAIndexes(baseBlock);
	const word = extractFirstBracketedWord(baseBlock);

	if (!ipaI || !word) {
		return baseBlock;
	}

	const ipa1 = ipaI[1];

	if (!ipa1) {
		return baseBlock;
	}

	return (
		baseBlock.slice(0, ipa1 + 1) +
		`(https://youglish.com/pronounce/${word}/spanish)` +
		baseBlock.slice(ipa1 + 1)
	);
}

async function incertClipbordContentsInContextsBlock(
	baseBlock: string
): Promise<string> {
	return baseBlock;
}

function createDataviewQuery(word: string): string {
	return `\`\`\`dataview
LIST FROM [[]]
WHERE (file.name != this.file.name)
SORT file.ctime ASC
\`\`\``;
}

export default async function fillTemplate(
	plugin: TextEaterPlugin,
	editor: Editor,
	file: TFile,
	callBack?: () => void
) {
	const word = file.basename;

	try {
		const [dictionaryEntry, froms, morphems, valence] = await Promise.all([
			plugin.apiService.generateContent(
				prompts.generate_dictionary_entry,
				word
			),
			plugin.apiService.generateContent(prompts.generate_forms, word),
			plugin.apiService.generateContent(prompts.morphems, word),
			plugin.apiService.generateContent(prompts.generate_valence_block, word),
		]);

		const adjForms = extractAdjectiveForms(froms);

		const trimmedBaseEntrie = `${dictionaryEntry.replace('<agent_output>', '').replace('</agent_output>', '')}`;

		const baseBlock = await incertClipbordContentsInContextsBlock(
			incertYouglishLinkInIpa(trimmedBaseEntrie)
		);
		const morphemsBlock = createSectionBlock('MORFEMAS', morphems, longDash);
		const valenceBlock = createSectionBlock('VALENCIA', valence, longDash);
		const fromsBlock = createSectionBlock('FORMAS_GRAMATICALES', froms, longDash);
		const adjFormsBlock = createSectionBlock('FORMAS_ADJETIVALES', adjForms, longDash);
		const enlacesEntrantesBlock = createSectionBlock('ENLACES_ENTRANTES', createDataviewQuery(word), longDash);

		const blocks = [
			baseBlock,
			morphemsBlock,
			valenceBlock,
			fromsBlock,
			adjFormsBlock,
			enlacesEntrantesBlock,
		];
		const entrie = blocks.filter(Boolean).join(`\n${getSectionSeparator()}\n`);

		const normalForm = extractFirstBracketedWord(baseBlock);

		if (normalForm?.toLocaleLowerCase() === word.toLocaleLowerCase()) {
			await plugin.fileService.writeToOpenedFile(file.path, entrie);
		} else {
			await plugin.fileService.writeToOpenedFile(
				file.path,
				`[[${normalForm}]]`
			);
			await navigator.clipboard.writeText(entrie);
		}
	} catch (error) {
		new Notice(`Error: ${error.message}`);
	}
}

function extractBaseForms(text: string): string[] | null {
	const match = text.match(
		/Adjetivos:\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\],\s*\[\[(.*?)\]\]/
	);
	if (!match) {
		return null;
	}

	const [_, base, comparative, superlative] = match;

	return [base, comparative, superlative];
}

function extractAdjectiveForms(text: string): string {
	const baseForms = extractBaseForms(text);

	if (!baseForms) {
		return longDash;
	}

	const endings = ['o', 'a', 'os', 'as'];

	const result: string[] = [];

	for (const suf of baseForms) {
		for (const end of endings) {
			result.push(`[[${suf + end}]]`);
		}
	}

	return result.join(', ');
}
