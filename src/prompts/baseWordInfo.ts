export const get_base_word_info = `Given a Spanish word, analyze it and return structured JSON with grammatical information, IPA transcription, and an appropriate emoji.

OUTPUT FORMAT: Valid JSON object with the following structure:

{
  "interpretations": [
    {
      "part_of_speech": "sustantivo" | "verbo" | "adjetivo" | "adverbio" | "pronombre" | "preposicion" | "articulo" | "conjuncion" | "interjeccion" | "numeral" | "desconocido",
      "ground_form": "canonical form of the word",
      "ipa": "IPA transcription of the original input word in square brackets",
      "emoji": "appropriate emoji",
      "gender": "masculino" | "femenino" (optional, for nouns and adjectives),
      "number": "singular" | "plural" (optional, if applicable),
      "person": "primera" | "segunda" | "tercera" (optional, for verbs and pronouns),
      "tense": "presente" | "pasado" | "futuro" | "condicional" (optional, for verbs),
      "mood": "indicativo" | "subjuntivo" | "imperativo" (optional, for verbs)
    }
  ]
}

GROUND FORM RULES:
- Verbs: Use infinitive form (e.g., "comiendo" -> "comer")
- Adjectives: Use masculine singular form (e.g., "pura" -> "puro", "grandes" -> "grande")
- Nouns: Use singular form (e.g., "esperanzas" -> "esperanza")
- Other parts of speech: Use canonical form

IPA TRANSCRIPTION RULES:
- Use standard Spanish IPA notation for the ORIGINAL INPUT WORD
- Include primary stress mark (ˈ) before the stressed syllable
- Common Spanish IPA symbols: [θ] for 'c/z', [x] for 'j/g', [ŋ] for 'n' before 'g/k', [ʎ] for 'll', [ɾ] for single 'r', [r] for double 'rr'
- Enclose in square brackets: [example]

EXAMPLES:

Input: "comiendo"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "comer",
      "ipa": "[koˈmjendo]",
      "emoji": "🍽️",
      "tense": "presente",
      "mood": "indicativo"
    }
  ]
}

Input: "esperanzas"
Output: {
  "interpretations": [
    {
      "part_of_speech": "sustantivo",
      "ground_form": "esperanza",
      "ipa": "[espeˈɾanθas]",
      "emoji": "🕊️",
      "gender": "femenino",
      "number": "plural"
    }
  ]
}

Input: "pura"
Output: {
  "interpretations": [
    {
      "part_of_speech": "adjetivo",
      "ground_form": "puro",
      "ipa": "[ˈpuɾa]",
      "emoji": "💎",
      "gender": "femenino",
      "number": "singular"
    }
  ]
}

Input: "aquí"
Output: {
  "interpretations": [
    {
      "part_of_speech": "adverbio",
      "ground_form": "aquí",
      "ipa": "[aˈki]",
      "emoji": "📍"
    }
  ]
}

Input: "estaban"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "estar",
      "ipa": "[esˈtaβan]",
      "emoji": "🧍",
      "person": "tercera",
      "number": "plural",
      "tense": "pasado",
      "mood": "indicativo"
    }
  ]
}

Input: "pasada"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "pasar",
      "ipa": "[paˈsaða]",
      "emoji": "🕰️",
      "gender": "femenino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "pasada",
      "ipa": "[paˈsaða]",
      "emoji": "🕰️",
      "gender": "femenino",
      "number": "singular"
    }
  ]
}

Input: "trabajador"
Output: {
  "interpretations": [
    {
      "part_of_speech": "adjetivo",
      "ground_form": "trabajador",
      "ipa": "[tɾaβaxaˈðoɾ]",
      "emoji": "💼",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "trabajador",
      "ipa": "[tɾaβaxaˈðoɾ]",
      "emoji": "💼",
      "gender": "masculino",
      "number": "singular"
    }
  ]
}

Input: "como"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "comer",
      "ipa": "[ˈkomo]",
      "emoji": "🍽️",
      "person": "primera",
      "number": "singular",
      "tense": "presente",
      "mood": "indicativo"
    },
    {
      "part_of_speech": "conjuncion",
      "ground_form": "como",
      "ipa": "[ˈkomo]",
      "emoji": "🔗"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "como",
      "ipa": "[ˈkomo]",
      "emoji": "❓"
    },
    {
      "part_of_speech": "preposicion",
      "ground_form": "como",
      "ipa": "[ˈkomo]",
      "emoji": "🔗"
    }
  ]
}

Input: "fuera"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "ser",
      "ipa": "[ˈfweɾa]",
      "emoji": "🧍",
      "person": "tercera",
      "number": "singular",
      "tense": "pasado",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "verbo",
      "ground_form": "ir",
      "ipa": "[ˈfweɾa]",
      "emoji": "🚶",
      "person": "tercera",
      "number": "singular",
      "tense": "pasado",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "fuera",
      "ipa": "[ˈfweɾa]",
      "emoji": "🚪"
    },
    {
      "part_of_speech": "preposicion",
      "ground_form": "fuera",
      "ipa": "[ˈfweɾa]",
      "emoji": "🚪"
    }
  ]
}

Input: "que"
Output: {
  "interpretations": [
    {
      "part_of_speech": "conjuncion",
      "ground_form": "que",
      "ipa": "[ke]",
      "emoji": "🔗"
    },
    {
      "part_of_speech": "pronombre",
      "ground_form": "que",
      "ipa": "[ke]",
      "emoji": "❓"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "que",
      "ipa": "[ke]",
      "emoji": "❓"
    }
  ]
}

Input: "sea"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "ser",
      "ipa": "[ˈsea]",
      "emoji": "🧍",
      "person": "tercera",
      "number": "singular",
      "tense": "presente",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "sea",
      "ipa": "[ˈsea]",
      "emoji": "🌊",
      "gender": "femenino",
      "number": "singular"
    }
  ]
}

Input: "solo"
Output: {
  "interpretations": [
    {
      "part_of_speech": "adjetivo",
      "ground_form": "solo",
      "ipa": "[ˈsolo]",
      "emoji": "👤",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "solo",
      "ipa": "[ˈsolo]",
      "emoji": "👤"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "solo",
      "ipa": "[ˈsolo]",
      "emoji": "🎵",
      "gender": "masculino",
      "number": "singular"
    }
  ]
}

Input: "medio"
Output: {
  "interpretations": [
    {
      "part_of_speech": "adjetivo",
      "ground_form": "medio",
      "ipa": "[ˈmeðjo]",
      "emoji": "➗",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "medio",
      "ipa": "[ˈmeðjo]",
      "emoji": "🔄",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "medio",
      "ipa": "[ˈmeðjo]",
      "emoji": "➗"
    },
    {
      "part_of_speech": "verbo",
      "ground_form": "medir",
      "ipa": "[ˈmeðjo]",
      "emoji": "📏",
      "person": "primera",
      "number": "singular",
      "tense": "presente",
      "mood": "indicativo"
    }
  ]
}

Input: "la"
Output: {
  "interpretations": [
    {
      "part_of_speech": "articulo",
      "ground_form": "la",
      "ipa": "[la]",
      "emoji": "👁️",
      "gender": "femenino",
      "number": "singular"
    },
    {
      "part_of_speech": "pronombre",
      "ground_form": "la",
      "ipa": "[la]",
      "emoji": "👁️",
      "gender": "femenino",
      "number": "singular"
    }
  ]
}

Input: "¡ay!"
Output: {
  "interpretations": [
    {
      "part_of_speech": "interjeccion",
      "ground_form": "¡ay!",
      "ipa": "[ai]",
      "emoji": "😱"
    }
  ]
}

Input: "tres"
Output: {
  "interpretations": [
    {
      "part_of_speech": "numeral",
      "ground_form": "tres",
      "ipa": "[tɾes]",
      "emoji": "3️⃣",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "tres",
      "ipa": "[tɾes]",
      "emoji": "3️⃣",
      "gender": "masculino",
      "number": "singular"
    }
  ]
}

Input: "xkdpqw"
Output: {
  "interpretations": [
    {
      "part_of_speech": "desconocido",
      "ground_form": "xkdpqw",
      "ipa": "[xkdpkw]",
      "emoji": "❓"
    }
  ]
}

Return ONLY valid JSON. Do not include explanations or additional text.`;
