import { keymaker } from 'prompts/keymaker';
import { determine_infinitive_and_pick_emoji } from 'prompts/determine-infinitive-and-pick-emoji';
import { normalize } from 'prompts/normalize';
import { translate_de_to_eng } from 'prompts/translate-de-to-eng';
import { generate_valence_block } from './valence';
import { generate_forms } from './generate-forms';
import { baseDict } from './baseDict';
import { morphems } from './morphems';
import { C1_RICHTER_PROMPT_V2 } from './c1Richter';

export const prompts = {
	generate_dictionary_entry: baseDict,
	c1Richter: C1_RICHTER_PROMPT_V2,
	generate_forms,
	morphems,
	determine_infinitive_and_pick_emoji,
	normalize,
	translate_de_to_eng,
	keymaker,
	generate_valence_block,
};
