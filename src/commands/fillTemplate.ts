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

function cleanAITags(content: string): string {
	return content
		.replace(/<agent_output>/g, '')
		.replace(/<\/agent_output>/g, '')
		.replace(/^<agent_output>/, '')
		.replace(/<\/agent_output>$/, '')
		.trim();
}

function ensureProperSpacing(content: string): string {
	// Remove any trailing whitespace and ensure content ends with a single newline
	return content.trim();
}

function joinBlocksWithProperSpacing(blocks: string[], separator: string): string {
	// Filter out empty blocks and ensure proper spacing
	const cleanBlocks = blocks
		.filter(Boolean)
		.map(block => ensureProperSpacing(block));
	
	// Join with proper spacing: content + empty line + separator + empty line + content
	return cleanBlocks.join(`\n\n${separator}\n`);
}

function isVerb(content: string): boolean {
	// Check if the content contains verb patterns like "→ [[word]] → haber [[word]]"
	// or conjugation tables, or infinitive patterns
	return (
		content.includes('→') &&
		content.includes('haber') &&
		content.includes('[[')
	) || content.includes('Infinitivo') || content.includes('Participio');
}

function createConjugationLink(word: string): string {
	return `**Conjugación**: [elconjugador.com](https://www.elconjugador.com/conjugacion/verbo/${word}.html)`;
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

		const trimmedBaseEntrie = cleanAITags(dictionaryEntry);

		const baseBlock = await incertClipbordContentsInContextsBlock(
			incertYouglishLinkInIpa(trimmedBaseEntrie)
		);
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

		const blocks = [
			baseBlock,
			morphemsBlock,
			valenceBlock,
			fromsBlock,
			adjFormsBlock,
			enlacesEntrantesBlock,
		];
		const entrie = joinBlocksWithProperSpacing(blocks, getSectionSeparator());

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
