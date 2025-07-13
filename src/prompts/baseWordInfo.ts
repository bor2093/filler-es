export const get_base_word_info = `Given a Spanish word, analyze it and return structured JSON with grammatical information and an appropriate emoji.

OUTPUT FORMAT: Valid JSON object with the following structure:

{
  "interpretations": [
    {
      "part_of_speech": "sustantivo" | "verbo" | "adjetivo" | "adverbio" | "pronombre" | "preposicion" | "articulo" | "conjuncion" | "interjeccion" | "numeral" | "desconocido",
      "ground_form": "canonical form of the word",
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

EXAMPLES:

Input: "comiendo"
Output: {
  "interpretations": [
    {
      "part_of_speech": "verbo",
      "ground_form": "comer",
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
      "emoji": "🕰️",
      "gender": "femenino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "pasada",
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
      "emoji": "💼",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "trabajador",
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
      "emoji": "🍽️",
      "person": "primera",
      "number": "singular",
      "tense": "presente",
      "mood": "indicativo"
    },
    {
      "part_of_speech": "conjuncion",
      "ground_form": "como",
      "emoji": "🔗"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "como",
      "emoji": "❓"
    },
    {
      "part_of_speech": "preposicion",
      "ground_form": "como",
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
      "emoji": "🧍",
      "person": "tercera",
      "number": "singular",
      "tense": "pasado",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "verbo",
      "ground_form": "ir",
      "emoji": "🚶",
      "person": "tercera",
      "number": "singular",
      "tense": "pasado",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "fuera",
      "emoji": "🚪"
    },
    {
      "part_of_speech": "preposicion",
      "ground_form": "fuera",
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
      "emoji": "🔗"
    },
    {
      "part_of_speech": "pronombre",
      "ground_form": "que",
      "emoji": "❓"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "que",
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
      "emoji": "🧍",
      "person": "tercera",
      "number": "singular",
      "tense": "presente",
      "mood": "subjuntivo"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "sea",
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
      "emoji": "👤",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "solo",
      "emoji": "👤"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "solo",
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
      "emoji": "➗",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "medio",
      "emoji": "🔄",
      "gender": "masculino",
      "number": "singular"
    },
    {
      "part_of_speech": "adverbio",
      "ground_form": "medio",
      "emoji": "➗"
    },
    {
      "part_of_speech": "verbo",
      "ground_form": "medir",
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
      "emoji": "👁️",
      "gender": "femenino",
      "number": "singular"
    },
    {
      "part_of_speech": "pronombre",
      "ground_form": "la",
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
      "emoji": "3️⃣",
      "number": "singular"
    },
    {
      "part_of_speech": "sustantivo",
      "ground_form": "tres",
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
      "emoji": "❓"
    }
  ]
}

Return ONLY valid JSON. Do not include explanations or additional text.`;
