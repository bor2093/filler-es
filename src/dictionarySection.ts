import { Word } from './word';

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