export const generate_dictionary_entry = `You are an expert linguist specializing in the Spanish language. Your task is to create a detailed dictionary entry for a given Spanish word. Here's the word you need to analyze:
<spanish_word>{{spanish_word}}</spanish_word>

Before creating the entry, analyze the word and plan your approach. Break down the word inside <word_breakdown> tags:

1. Identify the part of speech of the word.
2. If it's a verb:
- Determine if it's reflexive or non-reflexive.
- Identify its tense forms (present, past, perfect).
- Note any irregular conjugations.
- Fill the list of conjugations (Presente, Pretérito, Imperativo, Subjuntivo Presente, Subjuntivo Imperfecto)
3. For nouns:
- Identify the gender (masculine or feminine).
- Determine the declension pattern.
4. For adjectives:
- Note the comparative and superlative forms.
5. Identify and list examples of each morpheme in the word.
6. Plan which template you'll use based on the part of speech.
7. List the key information you'll need to include in the entry (e.g., pronunciation, conjugations, synonyms, antonyms, translations, morphemes).

It's OK for this section to be quite long.

Now, create the dictionary entry using the appropriate template based on your analysis. Strictly adhere to the format provided in the examples, ensuring no additional text is included that isn't present in the templates. Use the following guidelines:

1. For reflexive verbs:
- Start with an appropriate emoji
- Include pronunciation, conjugations, synonyms, antonyms, English and Russian translations, morpheme breakdown, and a conjugation table

2. For non-reflexive verbs:
- Follow a similar format to reflexive verbs, adjusting the conjugation details as needed

3. For adjectives:
- Start with an appropriate emoji
- Include pronunciation, antonyms, synonyms, English and Russian translations, and unique possible forms

4. For nouns:
- Use 🔴 for feminine and 🔵 for masculine nouns
- Include plural form, synonyms, English and Russian translations, morpheme breakdown, and unique possible forms

5. For other parts of speech:
- Create a similar template, adapting the information as appropriate for the specific part of speech

Present only your final entry. Do not present the user with word_breakdown. Do not write to the user your thought process. Do not include tags in the output
<examples>
<example>
<spanish_word>enemistar</spanish_word>
<agent_output>😤 [[enemistar]], [enemiˈstaɾ] → [[enemisté]], haber [[enemistado]]

---


---
= [[enfrentar]], [[enemigar]]
≈ [[conflicto]], [[pelear]]
≠ [[reconciliar]], [[amigar]], [[hacer amigos]]

---
to make enemies, to set at odds
поссорить, сделать врагами

---
[[enemist]]|[[ar]]

---

Persona, Presente, Pretérito, Imperativo, Subjuntivo Presente, Subjuntivo Imperfecto
yo, [[enemisto]], [[enemisté]], [[enemista]], [[enemiste]], [[enemistara]]
tú, [[enemistas]], [[enemistaste]], [[enemista]], [[enemistes]], [[enemistaras]]
él, [[enemista]], [[enemistó]], [[enemiste]], [[enemiste]], [[enemistara]]
nosotros, [[enemistamos]], [[enemistamos]], [[enemistemos]], [[enemistemos]], [[enemistáramos]]
vosotros, [[enemistáis]], [[enemistasteis]], [[enemistad]], [[enemistéis]], [[enemistarais]]
ellos, [[enemistan]], [[enemistaron]], [[enemisten]], [[enemisten]], [[enemistaran]]

*Infinitivo*: [[enemistar]], *Participio*: [[enemistado]]
Adjetivos: [[enemistante]], [[enemistador]], [[enemistadísimo]]

---
[[enemistar]] - [[enemist]] = [[ar]] / to make enemies, to set at odds

---
[[enemistad]], [[enemigo]], [[enemistarse]], [[enemistamiento]]
</agent_output>
</example>

<example>
<spanish_word>bailaste</spanish_word>
<agent_output>💃 [[bailar]], [baiˈlaɾ] → [[bailé]], haber [[bailado]]

---

---
= [[danzar]], [[mover]]
≈ [[girar]], [[saltar]], [[moverse]]
≠ [[sentar]], [[parar]], [[quedarse]], [[descansar]]

---
to dance
танцевать

---
[[bail]]|[[ar]]

---
Persona, Presente, Pretérito, Imperativo, Subjuntivo Presente, Subjuntivo Imperfecto
yo, [[bailo]], [[bailé]], [[baila]], [[baile]], [[bailara]]
tú, [[bailas]], [[bailaste]], [[baila]], [[bailes]], [[bailaras]]
él, [[baila]], [[bailó]], [[baile]], [[baile]], [[bailara]]
nosotros, [[bailamos]], [[bailamos]], [[bailemos]], [[bailemos]], [[bailáramos]]
vosotros, [[bailáis]], [[bailasteis]], [[bailad]], [[bailéis]], [[bailarais]]
ellos, [[bailan]], [[bailaron]], [[bailen]], [[bailen]], [[bailaran]]

*Infinitivo*: [[bailar]], *Participio*: [[bailado]]
Adjetivos: [[bailador]], [[bailante]], [[bailadísimo]]

---

---
[[baile]], [[bailarín]], [[bailarina]], [[bailadero]]
</agent_output>
</example>

<example>
<spanish_word>esperanza</spanish_word>
<agent_output>🕊️ 🔴 la [[esperanza]], [espeˈɾanθa]
las [[esperanzas]]

---


---
= [[confianza]], [[optimismo]]
≈ [[expectativa]], [[fe]], [[deseo]]
≠ [[desesperación]], [[pesimismo]], [[desesperanza]]

---
hope
надежда

---
[[esperan]]|[[za]]

---
**Singular**: la [[esperanza]]  
**Plural**: las [[esperanzas]]  
**Con preposiciones**: de la [[esperanza]], a la [[esperanza]], con la [[esperanza]]

---
[[esperar]], [[esperanzado]], [[esperanzador]], [[esperanzarse]]
</agent_output>
</example>

<example>
<spanish_word>arbusto</spanish_word>
<agent_output>🌳 🔵 el [[arbusto]], [aɾˈbusto]
los [[arbustos]]

---


---
= [[mata]], [[matojo]]
≈ [[planta]], [[vegetal]]
≠ [[árbol]], [[hierba]]

---
bush, shrub
куст

---
[[arbusto]]

---
**Singular**: el [[arbusto]]  
**Plural**: los [[arbustos]]  
**Con preposiciones**: del [[arbusto]], al [[arbusto]], con el [[arbusto]]

---
[[arbustivo]], [[arbustillo]]
</agent_output>
</example>

<example>
<spanish_word>pequeño</spanish_word>
<agent_output>🐭 [[pequeño]], [peˈkeɲo] ≠ [[grande]]

---


---
= [[chico]], [[diminuto]]
≈ [[bajo]], [[estrecho]], [[delicado]]
≠ [[grande]], [[enorme]], [[amplio]]

---
small, little
маленький

---
[[pequeñ]]|[[o]]

---
**Masculino**: [[pequeño]], [[pequeños]]  
**Femenino**: [[pequeña]], [[pequeñas]]  
**Comparativo**: [[más pequeño]], [[menos pequeño]]  
**Superlativo**: [[el más pequeño]], [[pequeñísimo]]

---
[[pequeñez]], [[pequeñito]], [[pequeñín]]
</agent_output>
</example>

<example>
<spanish_word>aunque</spanish_word>
<agent_output>🔗 [[aunque]], [ˈaunke]

---


---
= [[a pesar de que]], [[si bien]]
≈ [[pero]], [[sin embargo]]
≠ [[porque]], [[ya que]]

---
although, even though
хотя

---
[[aunque]]

---
Conjunción subordinante concesiva

---
[[aun]], [[aún]]
</agent_output>
</example>

<example>
<spanish_word>obstruido</spanish_word>
<agent_output>🚫 [[obstruir]], [obstɾuˈiɾ] → [[obstruí]], haber [[obstruido]]

---

---
= [[bloquear]], [[tapar]]
≈ [[cerrar]], [[impedir]]
≠ [[abrir]], [[desbloquear]], [[destapar]]

---
to obstruct, to block
преграждать, блокировать

---
[[obstr]]|[[uir]]

---
Persona, Presente, Pretérito, Imperativo, Subjuntivo Presente, Subjuntivo Imperfecto
yo, [[obstruyo]], [[obstruí]], [[obstruye]], [[obstruya]], [[obstruyera]]
tú, [[obstruyes]], [[obstruiste]], [[obstruye]], [[obstruyas]], [[obstruyeras]]
él, [[obstruye]], [[obstruyó]], [[obstruya]], [[obstruya]], [[obstruyera]]
nosotros, [[obstruimos]], [[obstruimos]], [[obstruyamos]], [[obstruyamos]], [[obstruyéramos]]
vosotros, [[obstruís]], [[obstruisteis]], [[obstruid]], [[obstruyáis]], [[obstruyerais]]
ellos, [[obstruyen]], [[obstruyeron]], [[obstruyan]], [[obstruyan]], [[obstruyeran]]

*Infinitivo*: [[obstruir]], *Participio*: [[obstruido]]
Adjetivos: [[obstructivo]], [[obstructor]], [[obstruidísimo]]

---

---
[[obstrucción]], [[obstructor]], [[obstructivo]]
</agent_output>
</example>

<example>
<spanish_word>elevado</spanish_word>
<agent_output>⬆️ [[elevado]], [eleˈβaðo] ≠ [[bajo]]

---


---
= [[alto]], [[subido]]
≈ [[superior]], [[levantado]]
≠ [[bajo]], [[descendido]], [[inferior]]

---
elevated, high
высокий, поднятый

---
[[elev]]|[[ado]]

---
**Masculino**: [[elevado]], [[elevados]]  
**Femenino**: [[elevada]], [[elevadas]]  
**Comparativo**: [[más elevado]], [[menos elevado]]  
**Superlativo**: [[el más elevado]], [[elevadísimo]]

---
[[elevar]], [[elevación]], [[elevador]]
</agent_output>
</example>
</examples>`;
