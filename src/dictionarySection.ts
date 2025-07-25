import { Word } from './word';

/**
 * Centralized section headers for Spanish dictionary entries
 * This module provides consistent section headers and utilities for dictionary structure
 */
export const SECTION_HEADERS = {
  CONTEXTO: '### Contexto',
  SINONIMOS_Y_ANTONIMOS: '### Sinónimos y Antónimos',
  TRADUCCIONES: '### Traducciones',
  MORFEMAS: '### Morfemas',
  FORMAS_GRAMATICALES: '### Formas Gramaticales',
  VALENCIA: '### Valencia',
  FORMAS_ADJETIVALES: '### Formas Adjetivales',
  PALABRAS_RELACIONADAS: '### Palabras Relacionadas',
  ENLACES_ENTRANTES: '### Enlaces Entrantes'
} as const;

/**
 * Creates a section block with the appropriate header
 * @param headerKey - The header key from SECTION_HEADERS
 * @param content - The content to include in the section
 * @param longDash - The long dash character used to indicate empty content
 * @returns The formatted section block or empty string if content is empty
 */
export function createSectionBlock(
  headerKey: keyof typeof SECTION_HEADERS,
  content: string,
  longDash: string = '—'
): string {
  if (!content || content.replace('\n', '') === longDash) {
    return '';
  }
  
  const header = SECTION_HEADERS[headerKey];
  return `${header}\n${content}`;
}

/**
 * Creates the standard section separator
 * @returns The section separator string
 */
export function getSectionSeparator(): string {
  return '---';
}

/**
 * Abstract base class for dictionary entry sections
 * 
 * Each section of a dictionary entry (like morfemas, valencia, formas, etc.) 
 * should extend this class to provide consistent interface and behavior.
 * 
 * @example
 * ```typescript
 * class MorfemasSection extends DictionarySection {
 *   isApplicable(word: Word): boolean {
 *     // All words can have morphemes
 *     return true;
 *   }
 *   
 *   async initFromWord(word: Word): Promise<void> {
 *     // Generate morphemes content for verbo/sustantivo/etc.
 *     const content = await this.generateMorphemes(word);
 *     this.content = content;
 *   }
 * }
 * ```
 */
export abstract class DictionarySection {
	protected sectionName: string;

	/**
	 * Creates a new dictionary section instance
	 * @param sectionName - The name of the section (e.g., 'MORFEMAS', 'VALENCIA')
	 */
	constructor(sectionName: string) {
		this.sectionName = sectionName;
	}

	/**
	 * Returns the string representation of the section
	 * @returns The formatted section content
	 */
	abstract toString(): string;

	/**
	 * Determines if this section is applicable to the given word
	 * @param word - The word to check applicability for
	 * @returns True if this section should be included for the word
	 * 
	 * @example
	 * ```typescript
	 * const word = new Word('caminar', PartOfSpeech.VERBO, 'caminar');
	 * const valenciaSection = new ValenciaSection();
	 * if (valenciaSection.isApplicable(word)) {
	 *   // Valencia section applies to verbo
	 *   await valenciaSection.initFromWord(word);
	 * }
	 * ```
	 */
	abstract isApplicable(word: Word): boolean;

	/**
	 * Initializes the section content from an existing string
	 * Used when parsing existing dictionary entries
	 * @param content - The existing section content to parse
	 * 
	 * @example
	 * ```typescript
	 * const existingContent = "cam-in-ar\nraíz: cam- (acción de moverse)";
	 * const morfemasSection = new MorfemasSection();
	 * morfemasSection.initFromString(existingContent);
	 * console.log(morfemasSection.toString()); // outputs parsed content
	 * ```
	 */
	abstract initFromString(content: string): void;

	/**
	 * Initializes the section content from a Word object
	 * Used when generating new dictionary entries
	 * @param word - The word to generate content for
	 * 
	 * @example
	 * ```typescript
	 * const word = new Word('hermosa', PartOfSpeech.ADJETIVO, 'hermoso');
	 * const formasSection = new FormasSection();
	 * await formasSection.initFromWord(word);
	 * // Section now contains adjetivo forms: hermoso, hermosa, hermosos, hermosas
	 * ```
	 */
	abstract initFromWord(word: Word): Promise<void>;

	/**
	 * Gets the section name
	 * @returns The name of the section
	 */
	getSectionName(): string {
		return this.sectionName;
	}
}

/**
 * Context section for dictionary entries
 */
export class ContextoSection extends DictionarySection {
	constructor() {
		super('CONTEXTO');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Synonyms and antonyms section for dictionary entries
 */
export class SinonimosYAntonimosSection extends DictionarySection {
	constructor() {
		super('SINONIMOS_Y_ANTONIMOS');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Translations section for dictionary entries
 */
export class TraduccionesSection extends DictionarySection {
	constructor() {
		super('TRADUCCIONES');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Morphemes section for dictionary entries
 */
export class MorfemasSection extends DictionarySection {
	constructor() {
		super('MORFEMAS');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Grammatical forms section for dictionary entries
 */
export class FormasGramaticalesSection extends DictionarySection {
	constructor() {
		super('FORMAS_GRAMATICALES');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Valence section for dictionary entries
 */
export class ValenciaSection extends DictionarySection {
	constructor() {
		super('VALENCIA');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Adjectival forms section for dictionary entries
 */
export class FormasAdjetivalesSection extends DictionarySection {
	constructor() {
		super('FORMAS_ADJETIVALES');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Related words section for dictionary entries
 */
export class PalabrasRelacionadasSection extends DictionarySection {
	constructor() {
		super('PALABRAS_RELACIONADAS');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
}

/**
 * Incoming links section for dictionary entries
 */
export class EnlacesEntrantesSection extends DictionarySection {
	constructor() {
		super('ENLACES_ENTRANTES');
	}

	toString(): string {
		// TODO: Implement logic
		return '';
	}

	isApplicable(word: Word): boolean {
		// TODO: Implement logic
		return true;
	}

	initFromString(content: string): void {
		// TODO: Implement logic
	}

	async initFromWord(word: Word): Promise<void> {
		// TODO: Implement logic
	}
} 