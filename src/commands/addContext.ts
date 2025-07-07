import { Editor, Notice, TFile } from 'obsidian';
import TextEaterPlugin from '../main';
import { extractSentenceContainingWord, createBlockReference, addContextToFile, findOrCreateDictionaryEntry, isGroundFormWord } from '../contextUtils';
import fillTemplate from './fillTemplate';

/**
 * Determines if a capitalized word should be normalized to lowercase
 * Returns the normalized word and display format
 */
function normalizeCapitalization(word: string, contextSentence: string): { 
	normalizedWord: string, 
	displayFormat: string,
	shouldNormalize: boolean 
} {
	// If word is not capitalized, return as is
	if (word[0] !== word[0].toUpperCase()) {
		return { normalizedWord: word, displayFormat: word, shouldNormalize: false };
	}
	
	// Check if word is likely a proper noun (basic heuristics)
	const properNounIndicators = [
		// Countries and regions
		/^(España|Francia|Italia|Alemania|Rusia|China|Japón|Brasil|Argentina|México|Colombia|Venezuela|Perú|Chile|Ecuador|Bolivia|Paraguay|Uruguay|Guatemala|Honduras|Salvador|Nicaragua|Costa Rica|Panamá|Cuba|República Dominicana|Puerto Rico)$/i,
		// Cities
		/^(Madrid|Barcelona|Valencia|Sevilla|París|Londres|Roma|Berlín|Moscú|Tokio|Pekín|Nueva York|Los Ángeles|Chicago|Miami|Buenos Aires|Lima|Bogotá|Santiago|Caracas|Quito|La Paz|Asunción|Montevideo|Ciudad de México|Guadalajara|Monterrey)$/i,
		// Names (common Spanish names)
		/^(María|José|Antonio|Francisco|Manuel|David|Juan|Javier|Daniel|Carlos|Miguel|Rafael|Pedro|Ángel|Alejandro|Pablo|Sergio|Adrián|Fernando|Jorge|Mario|Luis|Jesús|Rubén|Óscar|Raúl|Enrique|Gonzalo|Iván|Cristian|Alberto|Víctor|Roberto|Eduardo|Andrés|Héctor|Diego|Álvaro|Arturo|Emilio|Guillermo|Ignacio|Lorenzo|Marcos|Nicolás|Patricio|Ricardo|Santiago|Tomás|Valentín|Ana|Carmen|Dolores|Elena|Isabel|Josefa|Juana|Lucía|Magdalena|Pilar|Rosa|Teresa|Beatriz|Cristina|Esperanza|Gloria|Inés|Irene|Laura|Lourdes|Marta|Mercedes|Montserrat|Nuria|Patricia|Rocío|Silvia|Soledad|Susana|Verónica|Yolanda)$/i,
		// Organizations, brands, etc.
		/^(Google|Microsoft|Apple|Amazon|Facebook|Twitter|Instagram|YouTube|Netflix|Samsung|Sony|Toyota|Ford|BMW|Mercedes|Volkswagen|Coca-Cola|Pepsi|McDonald's|Starbucks|Nike|Adidas|Zara|H&M)$/i,
		// Days of the week and months (these are actually lowercase in Spanish, but might be capitalized)
		/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo|Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)$/i
	];
	
	// Check if word matches any proper noun pattern
	const isProperNoun = properNounIndicators.some(pattern => pattern.test(word));
	
	if (isProperNoun) {
		// Keep proper nouns capitalized
		return { normalizedWord: word, displayFormat: word, shouldNormalize: false };
	}
	
	// Check if word is at the beginning of a sentence (likely capitalized due to position)
	const wordIndex = contextSentence.indexOf(word);
	const beforeWord = contextSentence.substring(0, wordIndex).trim();
	
	// If the word is at the beginning of the sentence or after sentence-ending punctuation
	const isAtSentenceStart = beforeWord.length === 0 || /[.!?]$/.test(beforeWord);
	
	if (isAtSentenceStart) {
		// Normalize to lowercase for dictionary, but preserve capitalization for display
		const normalizedWord = word.toLowerCase();
		const displayFormat = `${normalizedWord}|${word}`;
		return { normalizedWord, displayFormat, shouldNormalize: true };
	}
	
	// If capitalized but not at sentence start, treat as proper noun
	return { normalizedWord: word, displayFormat: word, shouldNormalize: false };
}

export default async function addContext(
	plugin: TextEaterPlugin,
	editor: Editor,
	file: TFile,
	selection: string
) {
	try {
		// Step 1: Clean up nested brackets and get clean word
		let cleanWord = selection;
		
		// Remove all nested brackets to get the clean word
		while (cleanWord.startsWith('[[') && cleanWord.endsWith(']]')) {
			cleanWord = cleanWord.slice(2, -2);
		}
		
		// Step 2: Extract context sentence BEFORE making any changes (using original text and cursor position)
		const fullText = editor.getValue();
		const cursorPos = editor.getCursor();
		const cursorOffset = editor.posToOffset(cursorPos);
		
		const contextResult = extractSentenceContainingWord(fullText, cleanWord, cursorOffset);
		if (!contextResult) {
			new Notice(`Could not extract context sentence for: ${selection}`);
			return;
		}
		
		const { sentence: contextSentence, startIndex: sentenceStartIndex } = contextResult;
		
		// Step 3: Normalize capitalization if needed
		const { normalizedWord, displayFormat, shouldNormalize } = normalizeCapitalization(cleanWord, contextSentence);
		
		// Step 4: Create the proper link format and replace selection
		const linkedWord = shouldNormalize ? `[[${displayFormat}]]` : `[[${normalizedWord}]]`;
		editor.replaceSelection(linkedWord);
		
		// Step 5: Check if dictionary entry exists, create if needed (using normalized word)
		const wordFile = await findOrCreateDictionaryEntry(plugin, normalizedWord);
		if (!wordFile) {
			new Notice(`Could not create dictionary entry for: ${normalizedWord}`);
			return;
		}

		// Step 6: Add anchor to the sentence in source document (using original sentence and its index)
		const blockRef = await createBlockReference(plugin, editor, file, contextSentence, sentenceStartIndex);
		if (!blockRef) {
			new Notice(`Could not create block reference for context`);
			return;
		}
        
		// Step 7: Determine if selected word is ground form (using normalized word)
		const isGroundForm = await isGroundFormWord(plugin, normalizedWord);
		
		// Step 8: Add context to appropriate dictionary entries (using normalized word)
		await addContextToFile(plugin, normalizedWord, file.basename, blockRef, isGroundForm);
		
		new Notice(`Context added for: ${shouldNormalize ? `${cleanWord} → ${normalizedWord}` : normalizedWord}`);
		
		// Step 9: Switch to the dictionary entry file
		try {
			const leaf = plugin.app.workspace.getLeaf();
			await leaf.openFile(wordFile);
		} catch (error) {
			console.error('Error switching to dictionary entry:', error);
			// Don't show error notice as context was still added successfully
		}
		
	} catch (error) {
		new Notice(`Error adding context: ${error.message}`);
		console.error('Error in addContext:', error);
	}
} 