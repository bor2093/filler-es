import { Trennbarkeit, Regelmaessigkeit, Genus, Wortart, NomenDeklination, Kasus, PartizipVariant, PartikelType, AdverbCategory, Numerus, PronomenType } from "prompts/endgame/zod/types";

const sitzen = {
  "sitzen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "sitzen",
      grundform: "sitzen",
      emojiBeschreibungs: ["💺"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const sitz = {
  "sitz": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "sitz",
      grundform: "sitzen",
      emojiBeschreibungs: ["💺"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Sitz",
      grundform: "Sitz",
      emojiBeschreibungs: ["🪑"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const untergen = {
  "untergen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "untergehen",
      grundform: "untergehen",
      emojiBeschreibungs: ["🌅"],
      trennbarkeit: Trennbarkeit.Trennbar,
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const aufgepast = {
  "aufgepast": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "aufgepasst",
      grundform: "aufpassen",
      emojiBeschreibungs: ["👀"],
      trennbarkeit: Trennbarkeit.Trennbar,
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const Hoffungen = {
  "Hoffungen": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Hoffnungen",
      grundform: "Hoffnung",
      emojiBeschreibungs: ["🙏"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const hangstauf = {
  "hangstauf": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "hängst auf",
      grundform: "aufhängen",
      emojiBeschreibungs: ["🖼️"],
      trennbarkeit: Trennbarkeit.Trennbar,
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const nieser = {
  "nieser": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "niest",
      grundform: "niesen",
      emojiBeschreibungs: ["🤧"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Nieser",
      grundform: "Nieser",
      emojiBeschreibungs: ["🤧"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Schwach,
    }
  ]
};

const klares = {
  "klares": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "klares",
      grundform: "klar",
      emojiBeschreibungs: ["✨"],
    }
  ]
};

const klar = {
  "klar": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "klar",
      grundform: "klar",
      emojiBeschreibungs: ["✨"],
    },
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "klar",
      grundform: "klar",
      emojiBeschreibungs: ["✨"],
      adverbCategory: [AdverbCategory.Grad],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Klar",
      grundform: "Klar",
      emojiBeschreibungs: ["✨"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const hiemwerken = {
  "hiemwerken": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "heimwerken",
      grundform: "heimwerken",
      emojiBeschreibungs: ["🔨"],
      trennbarkeit: Trennbarkeit.Untrennbar,
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Heimwerken",
      grundform: "Heimwerk",
      emojiBeschreibungs: ["🛠"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const unbandiges = {
  "unbandiges": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "unbandiges",
      grundform: "unbändig",
      emojiBeschreibungs: ["🔥"],
    },
  ]
};

const backen = {
  "backen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "backen",
      grundform: "backen",
      emojiBeschreibungs: ["🍞"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "backen",
      grundform: "backen",
      emojiBeschreibungs: ["🍞"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Backe",
      grundform: "Backe",
      emojiBeschreibungs: ["😊"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const Rechercheergbnisse = {
  "Rechercheergbnisse": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Rechercheergebnisse",
      grundform: "Rechercheergebnis",
      emojiBeschreibungs: ["🔍"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const See = {
  "See": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "See",
      grundform: "See",
      emojiBeschreibungs: ["🏞"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "See",
      grundform: "See",
      emojiBeschreibungs: ["🌊"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const trotz = {
  "trotz": [
    {
      wortart: Wortart.Praeposition,
      rechtschreibung: "trotz",
      grundform: "trotz",
      emojiBeschreibungs: ["🛡"],
      possibleGoverningKasuss: ["Genitiv"],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Trotz",
      grundform: "Trotz",
      emojiBeschreibungs: ["😤"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "trotz",
      grundform: "trotzen",
      emojiBeschreibungs: ["😤"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const trozdem = {
  "trozdem": [
    {
      wortart: Wortart.Adverb,
      adverbCategory: [AdverbCategory.Modal],
      rechtschreibung: "trotzdem",
      grundform: "trotzdem",
      emojiBeschreibungs: ["💪🔥"]
    }
  ]
};

const mit = {
  "mit": [
    {
      wortart: Wortart.Praeposition,
      rechtschreibung: "mit",
      grundform: "mit",
      emojiBeschreibungs: ["🤝"],
      possibleGoverningKasuss: [Kasus.Dativ],
    },
    {
      wortart: Wortart.Praefix,
      rechtschreibung: "mit",
      grundform: "mit",
      emojiBeschreibungs: ["🤝"],
    }
  ]
};

const an = {
  "an": [
    {
      wortart: Wortart.Praeposition,
      rechtschreibung: "an",
      grundform: "an",
      emojiBeschreibungs: ["📍"],
      possibleGoverningKasuss: [Kasus.Dativ, Kasus.Akkusativ],
    },
    {
      wortart: Wortart.Praefix,
      rechtschreibung: "an",
      grundform: "an",
      emojiBeschreibungs: ["📍"],
    }
  ]
};

const selbst = {
  "selbst": [
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "selbst",
      grundform: "selbst",
      emojiBeschreibungs: ["🙋"],
      adverbCategory: [AdverbCategory.Modal],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Selbst",
      grundform: "Selbst",
      emojiBeschreibungs: ["🪞"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    },
  ]
};

const uber = {
  "uber": [
    {
      wortart: Wortart.Praeposition,
      rechtschreibung: "über",
      grundform: "über",
      emojiBeschreibungs: ["🔝"],
      possibleGoverningKasuss: [Kasus.Dativ, Kasus.Akkusativ],
    },
    {
      wortart: Wortart.Praefix,
      rechtschreibung: "über",
      grundform: "über",
      emojiBeschreibungs: ["🔝"],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Uber",
      grundform: "Uber",
      emojiBeschreibungs: ["🏙️"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
      eigenname: true,
    }
  ]
};

const umfaren = {
  "umfaren": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "umfahren",
      grundform: "umfahren",
      emojiBeschreibungs: ["🚗🔄"],
      trennbarkeit: Trennbarkeit.Trennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "umfahren",
      grundform: "umfahren",
      emojiBeschreibungs: ["🚗💥"],
      trennbarkeit: Trennbarkeit.Untrennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Umfahren",
      grundform: "Umfahrt",
      emojiBeschreibungs: ["🚗🔄"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const geoffnet = {
  "geoffnet": [
    {
      wortart: Wortart.PartizipialesAdjektiv,
      rechtschreibung: "geöffnet",
      grundform: "öffnen",
      emojiBeschreibungs: ["🚪👐"],
      partizipVariant: PartizipVariant.P2,
    },
  ]
};

const verfallen = {
  "verfallen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "verfallen",
      grundform: "verfallen",
      emojiBeschreibungs: ["🏚️"],
      trennbarkeit: Trennbarkeit.Untrennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.PartizipialesAdjektiv,
      rechtschreibung: "verfallen",
      grundform: "verfallen",
      emojiBeschreibungs: ["🏚️"],
      partizipVariant: PartizipVariant.P2,
    }
  ]
};

const verfall = {
  "verfall": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "verfall",
      grundform: "verfallen",
      emojiBeschreibungs: ["🏚️"],
      trennbarkeit: Trennbarkeit.Untrennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      rechtschreibung: "Verfall",
      grundform: "Verfall",
      wortart: Wortart.Nomen,
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
      emojiBeschreibungs: ["🏚️"],
    }
  ]
};

const derVerfall = {
  "der verfall": [
    {
      rechtschreibung: "Verfall",
      grundform: "Verfall",
      wortart: Wortart.Nomen,
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
      emojiBeschreibungs: ["🏚️"],
    }
  ]
};

const schloss = {
  "schloss": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Schloss",
      grundform: "Schloss",
      emojiBeschreibungs: ["🏰", "🔒"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "schließen",
      grundform: "schließen",
      emojiBeschreibungs: ["🚪"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    }
  ]
};

const gehobener = {
  "gehobener": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "gehoben",
      grundform: "gehoben",
      emojiBeschreibungs: ["🎩"],
    }
  ]
};

const wahlwiese = {
  "wahlwiese": [
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "wahlweise",
      grundform: "wahlweise",
      emojiBeschreibungs: ["🔀"],
      adverbCategory: [AdverbCategory.Modal],
    }
  ]
};

const deutschen = {
  "deutschen": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "deutschen",
      grundform: "deutsch",
      emojiBeschreibungs: ["🇩🇪"],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Deutsche",
      grundform: "Deutsche",
      emojiBeschreibungs: ["🇩🇪"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const deutsch = {
  "deutsch": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "deutsch",
      grundform: "deutsch",
      emojiBeschreibungs: ["🇩🇪"],
    },
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "deutsch",
      grundform: "deutsch",
      emojiBeschreibungs: ["🇩🇪"],
      adverbCategory: [AdverbCategory.Modal],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Deutsche",
      grundform: "Deutsche",
      emojiBeschreibungs: ["🇩🇪"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const laden = {
  "laden": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "laden",
      grundform: "laden",
      emojiBeschreibungs: ["📦➡️🚚"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "laden",
      grundform: "laden",
      emojiBeschreibungs: ["✉️➡️👥"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Laden",
      grundform: "Laden",
      emojiBeschreibungs: ["🏪🛍️"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const gefallen = {
  "gefallen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "gefallen",
      grundform: "gefallen",
      emojiBeschreibungs: ["👍"],
      trennbarkeit: Trennbarkeit.Untrennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
    {
      wortart: Wortart.PartizipialesAdjektiv,
      rechtschreibung: "gefallen",
      grundform: "gefallen",
      emojiBeschreibungs: ["👍"],
      partizipVariant: PartizipVariant.P2,
    }
  ]
};

const wende = {
  "wende": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Wende",
      grundform: "Wende",
      emojiBeschreibungs: ["🔄"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "wende",
      grundform: "wenden",
      emojiBeschreibungs: ["🔄"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "wende",
      grundform: "wenden",
      emojiBeschreibungs: ["👉💬"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    }
  ]
};

const stapelbaren = {
  "stapelbaren": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "stapelbaren",
      grundform: "stapelbar",
      emojiBeschreibungs: ["📦"],
    }
  ]
};

const vorbei = {
  "vorbei": [
    {
      wortart: Wortart.Praeposition,
      rechtschreibung: "vorbei",
      grundform: "vorbei",
      emojiBeschreibungs: ["🏃‍♂️💨"],
    },
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "vorbei",
      grundform: "vorbei",
      emojiBeschreibungs: ["🏁"],
      adverbCategory: [AdverbCategory.Lokal],
    }
  ]
};

const mystery = `a – das Kissen hab' ich auch [[bekommen]].  
Aber es ist vorbei! [[vorbei]]! Und [[jetzt]] [[heul]] bitte nicht!  
Tschüs.  
Männer!`

const shit = {
  [`${mystery}`]: [
    {
      wortart: Wortart.Unbekannt, 
      rechtschreibung: "Unbekannt",
      grundform: "Unbekannt",
      emojiBeschreibungs: ["❓"],
      comment: "Der Text ist kein einzelnes Wort und enthält keine bekannten Redewendungen.",
    }
  ]
};

const augeben = {
  "augeben": [
    {
      wortart: Wortart.Unbekannt, 
      rechtschreibung: "Unbekannt",
      grundform: "Unbekannt",
      emojiBeschreibungs: ["❓"],
      comment: "Ich kann deine Absicht nicht feststellen. Vielleicht hast du [[ausgeben]] oder [[aufgeben]] gemeint?",
    }
  ]
};


const spazirengegangen = {
  "ging spaziren": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "ging spazieren",
      grundform: "spazieren gehen",
      emojiBeschreibungs: ["🚶‍♂️"],
      trennbarkeit: Trennbarkeit.Trennbar,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    }
  ]
};

const doch = {
  "doch": [
    {
      wortart: Wortart.Partikel,
      rechtschreibung: "doch",
      grundform: "doch",
      emojiBeschreibungs: ["💬"],
      partikelType: [PartikelType.Konnektiv],
    }
  ]
};

const Redewendung1 = {
  "das eis zwischen sie ist gebrochen": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "Das Eis brechen",
      grundform: "Das Eis brechen",
      emojiBeschreibungs: ["❄️🧊"],
    }
  ],
};

const schaffen = {
  "schaffen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "schaffen",
      grundform: "schaffen",
      emojiBeschreibungs: ["💪✅"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "schaffen",
      grundform: "schaffen",
      emojiBeschreibungs: ["✨🌍"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
  ]
};

const DieKuhIstNunVomEis = {
  "kuh ist nun vom eis": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "Kuh ist nun vom Eis",
      grundform: "die Kuh ist vom Eis",
      emojiBeschreibungs: ["🐄🧊"],
    }
  ]
};

const schafen = {
  "schafen": [
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Schafen",
      grundform: "Schaf",
      emojiBeschreibungs: ["🐑"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const mleken = {
  "mleken": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "melken",
      grundform: "melken",
      emojiBeschreibungs: ["🐄"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "melken",
      grundform: "melken",
      emojiBeschreibungs: ["🐄"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    }
  ]
};

const bewegen = {
  "bewegen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "bewegen",
      grundform: "bewegen",
      emojiBeschreibungs: ["💪➡️🪑"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "bewegen",
      grundform: "bewegen",
      emojiBeschreibungs: ["💬➡️😢"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
    },
  ]
};

const senden = {
  "senden": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "senden",
      grundform: "senden",
      emojiBeschreibungs: ["📤"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig
    },
    {
      wortart: Wortart.Verb,
      rechtschreibung: "senden",
      grundform: "senden",
      emojiBeschreibungs: ["📡"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig
    }
  ]
};

const genau = {
  "genau": [
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "genau",
      grundform: "genau",
      emojiBeschreibungs: ["✔️"],
      adverbCategory: [AdverbCategory.Modal],
    },
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "genau",
      grundform: "genau",
      emojiBeschreibungs: ["✔️"],
    }
  ]
};

const genauso = {
  "genauso": [
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "genauso",
      grundform: "genauso",
      emojiBeschreibungs: ["🤝"],
      adverbCategory: [AdverbCategory.Modal],
    }
  ]
};

const fussballbegeistert = {
  "fussballbegeistert": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "fußballbegeistert",
      grundform: "fußballbegeistert",
      emojiBeschreibungs: ["⚽️🔥"],
    }
  ]
};

const sofort = {
  "sofort": [
    {
      wortart: Wortart.Adverb,
      rechtschreibung: "sofort",
      grundform: "sofort",
      emojiBeschreibungs: ["⏱️"],
      adverbCategory: [AdverbCategory.Temporal],
    }
  ]
};

const zwar = {
  "zwar": [
    {
      wortart: Wortart.Partikel,
      rechtschreibung: "zwar",
      grundform: "zwar",
      emojiBeschreibungs: ["🔗"],
      partikelType: [PartikelType.Konnektiv],
    }
  ]
};

const weiss = {
  "weiss": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "weiß",
      grundform: "wissen",
      emojiBeschreibungs: ["🧠"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Weiß",
      grundform: "Weiß",
      emojiBeschreibungs: ["⚪️"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark,
    },
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "weiß",
      grundform: "weiß",
      emojiBeschreibungs: ["⚪️"],
    }
  ]
};

const wissen = {
  "wissen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "wissen",
      grundform: "wissen",
      emojiBeschreibungs: ["🧠"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Wissen",
      grundform: "Wissen",
      emojiBeschreibungs: ["🧠"],
      genus: Genus.Neutrum,
      deklination: NomenDeklination.Stark
    },
  ]
};

const erinern = {
  "erinern": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "erinnern",
      grundform: "erinnern",
      emojiBeschreibungs: ["🧠"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const rechnen = {
  "rechnen": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "rechnen",
      grundform: "rechnen",
      emojiBeschreibungs: ["🧮"],
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
    }
  ]
};

const glaubiger = {
  "glaubiger": [
    {
      wortart: Wortart.Adjektiv,
      rechtschreibung: "gläubiger",
      grundform: "gläubig",
      emojiBeschreibungs: ["🙏"],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Gläubiger",
      grundform: "Gläubiger",
      emojiBeschreibungs: ["💰"],
      genus: Genus.Maskulin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const sie = {
  "sie": [
    {
      wortart: Wortart.Pronomen,
      rechtschreibung: "sie",
      grundform: "sie",
      emojiBeschreibungs: ["👩"],
      pronomenType: PronomenType.Personal,
      number: [Numerus.Einzahl],
      genera: [Genus.Feminin],
    },
    {
      wortart: Wortart.Pronomen,
      rechtschreibung: "sie",
      grundform: "sie",
      emojiBeschreibungs: ["👥"],
      pronomenType: PronomenType.Personal,
      number: [Numerus.Mehrzahl],
    },
    {
      wortart: Wortart.Pronomen,
      rechtschreibung: "Sie",
      grundform: "sie",
      emojiBeschreibungs: ["🧑‍💼"],
      pronomenType: PronomenType.Personal,
      number: [Numerus.Einzahl, Numerus.Mehrzahl],
    }
  ]
};

const DasEisBrechen = {
  "eis zwischen ihnen ist gebrochen": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "das Eis zwischen ihnen ist gebrochen",
      grundform: "das Eis brechen",
      emojiBeschreibungs: ["🤝"],
    }
  ]
};

const halbenMette = {
  "halben Miete": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "halben Miete",
      grundform: "halbe Miete",
      emojiBeschreibungs: ["🔑🧩🎯"],
    }
  ]
};

const ganzUndGar = {
  "ganz und gar": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "ganz und gar",
      grundform: "ganz und gar",
      emojiBeschreibungs: ["💯👌"],
    }
  ]
};

const tomatenAufDenAugen = {
  "hast do tomaten auf den augen?": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "Hast do Tomaten auf den Augen?",
      grundform: "Tomaten auf den Augen haben",
      emojiBeschreibungs: ["🍅🙈🤷‍♂️"],
    }
  ]
};

const baerenAufgebracht = {
  "und ihm einen bären aufzubinden?": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "und ihm einen Bären aufzubinden?",
      grundform: "Jemandem einen Bären aufbinden",
      emojiBeschreibungs: ["🐻🤥🙄"],
    }
  ]
};

const durchUndDurch = {
  "durch und durch": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "durch und durch",
      grundform: "durch und durch",
      emojiBeschreibungs: ["💯👌"],
    }
  ]
};

const vollUndGanz = {
  "voll und ganz": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "voll und ganz",
      grundform: "voll und ganz",
      emojiBeschreibungs: ["🎯👌"],
    }
  ]
};

const nullUndNichtig = {
  "null und nichtig": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "null und nichtig",
      grundform: "null und nichtig",
      emojiBeschreibungs: ["0️⃣🚫"],
    }
  ]
};

const klippUndKlar = {
  "klipp und klar": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "klipp und klar",
      grundform: "klipp und klar",
      emojiBeschreibungs: ["✅"],
    }
  ]
};

const reinUndGar = {
  "rein und gar": [
    {
      wortart: Wortart.Redewendung,
      rechtschreibung: "rein und gar",
      grundform: "rein und gar",
      emojiBeschreibungs: ["✨👌"],
    }
  ]
};

const molken = {
  "molken": [
    {
      wortart: Wortart.Verb,
      rechtschreibung: "molken",
      grundform: "melken",
      emojiBeschreibungs: ["🐄"],
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Molken",
      grundform: "Molke",
      emojiBeschreibungs: ["🥛"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

const schleifen = {
  "schleifen": [
    {
      wortart: Wortart.Verb,
      regelmaessigkeit: Regelmaessigkeit.Regelmaessig,
      rechtschreibung: "schleifen",
      grundform: "schleifen",
      emojiBeschreibungs: ["⚙️✨"]
    },
    {
      wortart: Wortart.Verb,
      regelmaessigkeit: Regelmaessigkeit.Unregelmaessig,
      rechtschreibung: "schleifen",
      grundform: "schleifen",
      emojiBeschreibungs: ["🚶‍♂️💤"],
    },
    {
      wortart: Wortart.Nomen,
      rechtschreibung: "Schleifen",
      grundform: "Schleife",
      emojiBeschreibungs: ["🎀"],
      genus: Genus.Feminin,
      deklination: NomenDeklination.Stark,
    }
  ]
};

export const tests = {
  ...molken,
  ...sie,
  ...glaubiger,
  ...genau,
  ...genauso,
  ...fussballbegeistert,
  ...sofort,
  ...zwar,
  ...weiss,
  ...erinern,
  ...rechnen,
  ...nieser,
  ...sitz,
  ...sitzen,
  ...aufgepast, 
  ...untergen,
  ...Hoffungen,
  ...hangstauf,
  ...deutsch,
  ...hiemwerken,
  ...klares,
  ...Rechercheergbnisse,
  ...backen,
  ...unbandiges,
  ...See,
  ...trotz,
  ...mit,
  ...an,
  ...uber,
  ...selbst,
  ...umfaren,
  ...geoffnet,
  ...verfallen,
  ...schloss,
  ...gehobener,
  ...wahlwiese,
  ...deutschen,
  ...wende,
  ...stapelbaren,
  ...vorbei,
  ...spazirengegangen,
  ...doch,
  ...shit,
  ...laden,
  ...gefallen,
  ...Redewendung1,
  ...klar,
  ...mleken,
  ...bewegen,
  ...senden,
  ...DasEisBrechen,
  ...halbenMette,
  ...ganzUndGar,
  ...tomatenAufDenAugen,
  ...baerenAufgebracht,
  ...durchUndDurch,
  ...vollUndGanz,
  ...nullUndNichtig,
  ...klippUndKlar,
  ...reinUndGar,
  ...augeben,
  ...schafen,
  ...wissen,
  ...schaffen,
  ...DieKuhIstNunVomEis,
  ...verfall,
  ...derVerfall,
  ...trozdem,
  ...schleifen,
};