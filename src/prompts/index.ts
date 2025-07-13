import { keymaker } from 'prompts/keymaker';
import { get_base_word_info } from 'prompts/baseWordInfo';
import { normalize } from 'prompts/normalize';
import { translate_es_to_eng } from './translate-es-to-eng';
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
	get_base_word_info,
	normalize,
	translate_es_to_eng,
	keymaker,
	generate_valence_block,
};
