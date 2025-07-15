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
 * Gets all section headers as an array
 * @returns Array of all section header strings
 */
export function getAllSectionHeaders(): string[] {
  return Object.values(SECTION_HEADERS);
}

/**
 * Checks if a string contains a section header
 * @param text - The text to check
 * @returns The found section header or null
 */
export function findSectionHeader(text: string): string | null {
  return getAllSectionHeaders().find(header => text.includes(header)) || null;
}

/**
 * Creates the standard section separator
 * @returns The section separator string
 */
export function getSectionSeparator(): string {
  return '---';
}

/**
 * Creates a standardized dictionary entry template
 * @param headerContent - The header content (emoji, word, pronunciation, etc.)
 * @param sections - Object containing content for each section
 * @returns Complete dictionary entry with consistent formatting
 */
export function createDictionaryEntryTemplate(
  headerContent: string,
  sections: {
    contexto?: string;
    sinonimos?: string;
    traducciones?: string;
    morfemas?: string;
    formasGramaticales?: string;
    valencia?: string;
    formasAdjetivales?: string;
    palabrasRelacionadas?: string;
    enlacesEntrantes?: string;
  }
): string {
  const blocks = [headerContent];
  
  // Always add Contexto section (even if empty)
  blocks.push(
    getSectionSeparator(),
    SECTION_HEADERS.CONTEXTO,
    sections.contexto || ''
  );
  
  // Add other sections if they have content
  if (sections.sinonimos) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.SINONIMOS_Y_ANTONIMOS,
      sections.sinonimos
    );
  }
  
  if (sections.traducciones) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.TRADUCCIONES,
      sections.traducciones
    );
  }
  
  if (sections.morfemas) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.MORFEMAS,
      sections.morfemas
    );
  }
  
  if (sections.formasGramaticales) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.FORMAS_GRAMATICALES,
      sections.formasGramaticales
    );
  }
  
  if (sections.valencia) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.VALENCIA,
      sections.valencia
    );
  }
  
  if (sections.formasAdjetivales) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.FORMAS_ADJETIVALES,
      sections.formasAdjetivales
    );
  }
  
  if (sections.palabrasRelacionadas) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.PALABRAS_RELACIONADAS,
      sections.palabrasRelacionadas
    );
  }
  
  if (sections.enlacesEntrantes) {
    blocks.push(
      getSectionSeparator(),
      SECTION_HEADERS.ENLACES_ENTRANTES,
      sections.enlacesEntrantes
    );
  }
  
  return blocks.join('\n');
}

/**
 * Helper function to quickly create example entries for prompts
 * This makes it easier to maintain consistent examples across all prompt files
 * @param word - The Spanish word for the example
 * @param headerContent - The header line with emoji, word, pronunciation, etc.
 * @param sections - Content for each section
 * @returns Complete example entry
 */
export function createExampleEntry(
  word: string,
  headerContent: string,
  sections: {
    contexto?: string;
    sinonimos?: string;
    traducciones?: string;
    morfemas?: string;
    formasGramaticales?: string;
    valencia?: string;
    formasAdjetivales?: string;
    palabrasRelacionadas?: string;
    enlacesEntrantes?: string;
  }
): string {
  return `<example>
<spanish_word>${word}</spanish_word>
<agent_output>
${createDictionaryEntryTemplate(headerContent, sections)}
</agent_output>
</example>`;
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