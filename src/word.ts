/**
 * Part of speech enumeration for Spanish words
 */
export enum PartOfSpeech {
	VERBO = 'verbo',
	SUSTANTIVO = 'sustantivo',
	ADJETIVO = 'adjetivo',
	ADVERBIO = 'adverbio',
	PREPOSICION = 'preposicion',
	CONJUNCION = 'conjuncion',
	PRONOMBRE = 'pronombre',
	ARTICULO = 'articulo',
	INTERJECCION = 'interjeccion',
	NUMERAL = 'numeral',
	DESCONOCIDO = 'desconocido'
}

/**
 * Class representing a Spanish word with its linguistic attributes
 */
export class Word {
	private word: string;
	private partOfSpeech: PartOfSpeech;
	private groundForm: string;
	private grammaticalAttributes: Map<string, string>;

	/**
	 * Creates a new Word instance
	 * @param word - The word itself
	 * @param partOfSpeech - The part of speech
	 * @param groundForm - The base/canonical form of the word
	 * @param grammaticalAttributes - Map of grammatical attributes (e.g., "gender" -> "feminine", "number" -> "plural")
	 */
	constructor(
		word: string,
		partOfSpeech: PartOfSpeech,
		groundForm: string,
		grammaticalAttributes: Map<string, string> = new Map()
	) {
		this.word = word;
		this.partOfSpeech = partOfSpeech;
		this.groundForm = groundForm;
		this.grammaticalAttributes = grammaticalAttributes;
	}

	// Getters
	public getWord(): string {
		return this.word;
	}

	public getPartOfSpeech(): PartOfSpeech {
		return this.partOfSpeech;
	}

	public getGroundForm(): string {
		return this.groundForm;
	}

	public getGrammaticalAttributes(): Map<string, string> {
		return new Map(this.grammaticalAttributes);
	}

	// Setters
	public setWord(word: string): void {
		this.word = word;
	}

	public setPartOfSpeech(partOfSpeech: PartOfSpeech): void {
		this.partOfSpeech = partOfSpeech;
	}

	public setGroundForm(groundForm: string): void {
		this.groundForm = groundForm;
	}

	public setGrammaticalAttributes(attributes: Map<string, string>): void {
		this.grammaticalAttributes = new Map(attributes);
	}

	// Grammatical attributes helper methods
	public addGrammaticalAttribute(key: string, value: string): void {
		this.grammaticalAttributes.set(key, value);
	}

	public removeGrammaticalAttribute(key: string): boolean {
		return this.grammaticalAttributes.delete(key);
	}

	public getGrammaticalAttribute(key: string): string | undefined {
		return this.grammaticalAttributes.get(key);
	}

	public hasGrammaticalAttribute(key: string): boolean {
		return this.grammaticalAttributes.has(key);
	}

	// Utility methods
	public isGroundForm(): boolean {
		return this.word === this.groundForm;
	}
} 