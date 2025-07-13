import TextEaterPlugin from "main";

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
 * Interface for a single word interpretation from AI response
 */
export interface WordInterpretation {
	part_of_speech: PartOfSpeech;
	ground_form: string;
	emoji: string;
	gender?: 'masculino' | 'femenino';
	number?: 'singular' | 'plural';
	person?: 'primera' | 'segunda' | 'tercera';
	tense?: 'presente' | 'pasado' | 'futuro' | 'condicional';
	mood?: 'indicativo' | 'subjuntivo' | 'imperativo';
}

/**
 * Interface for the complete AI response containing word interpretations
 */
export interface BaseWordInfoResponse {
	interpretations: WordInterpretation[];
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

    public async initBaseWordInfo(plugin: TextEaterPlugin): Promise<void> { 
        try {
			const rawResponse = await plugin.apiService.getBaseWordInfo(this.word);
			if (!rawResponse) {
				return;
			}

            const cleanedResponse = rawResponse.replace(/^```json\s*/, '').replace(/```$/, '') 
			
			// Parse the JSON response
			const parsedResponse: BaseWordInfoResponse = JSON.parse(cleanedResponse);
			if (!parsedResponse || !parsedResponse.interpretations || parsedResponse.interpretations.length === 0) {
				return;
			}
			// Use the first interpretation (most likely)
            // TODO: Handle multiple interpretations
			const interpretation = parsedResponse.interpretations[0];
			// Set ground form
			this.setGroundForm(interpretation.ground_form);
			// Set part of speech
			this.setPartOfSpeech(interpretation.part_of_speech);
			// Set grammatical attributes
			this.setGrammaticalAttributes(this.extractGrammaticalAttributes(interpretation));
        } 
        catch (error) {
            console.error('Error determining ground form:', error);
        }
    }

    private extractGrammaticalAttributes(interpretation: WordInterpretation): Map<string, string> {
        const attributes = new Map<string, string>();
        
        // Add optional attributes if they exist
        if (interpretation.gender) {
            attributes.set('gender', interpretation.gender);
        }
        if (interpretation.number) {
            attributes.set('number', interpretation.number);
        }
        if (interpretation.person) {
            attributes.set('person', interpretation.person);
        }
        if (interpretation.tense) {
            attributes.set('tense', interpretation.tense);
        }
        if (interpretation.mood) {
            attributes.set('mood', interpretation.mood);
        }
        if (interpretation.emoji) {
            attributes.set('emoji', interpretation.emoji);
        }
        
        return attributes;
    }

    /**
     * Get all available interpretations for this word
     */
    public async getAllInterpretations(plugin: TextEaterPlugin): Promise<WordInterpretation[]> {
        try {
            const response = await plugin.apiService.getBaseWordInfo(this.word);
            if (!response) {
                return [];
            }
            
            const parsedResponse: BaseWordInfoResponse = JSON.parse(response);
            return parsedResponse.interpretations || [];
        } catch (error) {
            console.error('Error getting all interpretations:', error);
            return [];
        }
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