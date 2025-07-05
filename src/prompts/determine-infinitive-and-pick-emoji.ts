export const determine_infinitive_and_pick_emoji = `Given a spanish word, determine its normal form and pick an appropriate emoji to represent it. In this context, gerundio's normal form is an infinitive of a corresponding verb. If the word is a noun, determine its gender and use 🔵 for el, 🔴 for la, 🟢 for lo. Do not write anything else, just the infinitive and an emoji. 
Examples (input -> output):
"comiendo" -> "🍽️ [[comer]]",
"trabajado" -> "💼 [[trabajar]]",
"esperanzas" -> "🔴 la [[esperanza]] 🕊️",
"helados" -> "🥶 [[helado]]",
"segundos" -> "2️⃣ [[segundo]]",
"situación" -> "🔴 la [[situación]] 📍",
"aquí" -> "📍 [[aquí]]",
"estaban" -> "🧍 [[estar]]",
The output should be compact, without extra spaces or newlines.

If a word can be a form of multiple parts of speech, list all options, separated with |. Examples (input -> output):
"pasada" -> "🕰️ [[pasar]] | 🔴 la [[pasada]] 🕰️",
"cantante" -> "🎵 [[cantar]] | 🔵 el [[cantante]] 🎵",
"claros" -> "😌 [[clarificar]] | 😌 [[claro]] | 🔵 el [[claro]] 😌",
"trabajador" -> "💼 [[trabajar]] | 🔵 el [[trabajador]] 💼",
"construir" -> "🏗️ [[construir]] | 🔵 el [[construir]] 🏗️",
"españoles" -> "🔵 el [[español]] 🇪🇸 | 🇪🇸 [[español]]",
"increíbles" -> "🤩 [[increíble]] | 🔵 el [[increíble]] 🤩",
"elevado" -> "⬆️ [[elevar]] | 🔵 el [[elevado]] ⬆️",
`;
