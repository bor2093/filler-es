# Spanish Dictionary Builder (Obsidian Plugin)

<p align="center">
   <img src="img/new-icon.png" alt="icon" width="300"/>
</p>

**Transform your Spanish learning with an intelligent, AI-powered dictionary builder for Obsidian.**

Open a Spanish text.\
Select an unknown word.\
Add it to your dictionary with context.\
Build connections between words.\
Create your personalized Spanish knowledge base.



## Overview

This Obsidian plugin helps you build a comprehensive Spanish dictionary with automatic word form detection, context examples, and intelligent linking between related words. It leverages AI to generate detailed dictionary entries and creates a connected knowledge base for effective Spanish learning.


## Key Features

### 🎯 **Core Dictionary Commands**

#### 1. **Generate Dictionary Entry** (Alt + Shift + G)
Creates comprehensive dictionary entries including:
- **Header with emoji indicators** (🔴 feminine, 🔵 masculine for nouns)
- **Pronunciation** with IPA notation and YouGlish links
- **Word forms** (conjugations, plurals, gender variations)  
- **Morphological breakdown** with linked morphemes
- **Valence patterns** (for verbs)
- **Grammar forms** with full conjugation tables
- **Smart tagging** (ground form vs. derived form)
- **Automatic file organization** with sharded folder structure

#### 2. **Add Context to Dictionary** (Alt + Shift + C)
Intelligently adds context examples with:
- **Smart anchoring** - creates block references (`^1`, `^2`, etc.)
- **Source linking** - `*[[filename#^1|^]]* context sentence`
- **Ground form handling** - adds context to both word and its base form
- **Capitalization normalization** - handles sentence-initial words properly
- **Cursor-aware sentence detection** - finds the exact sentence you're working with
- **Auto-navigation** - automatically opens dictionary entry after adding context

#### 3. **Find Base Form** (Alt + Shift + I)
Automatically determines the infinitive/base form of selected words:
- **Intelligent form detection** - `corrían` → `correr`
- **Creates base form entries** if they don't exist
- **Links derived forms** to base forms automatically

### 🔧 **Text Processing Commands**

#### 4. **Normalize Selection (Add Links)** (Alt + Shift + S)
Transforms Spanish text into a linked knowledge base:
- **Grammar-aware linking** - `corrían` → `[[correr|corrían]]`
- **Handles complex forms** - reflexive verbs, compound tenses, plurals
- **Smart exclusions** - leaves pronouns, auxiliary verbs unlinked
- **Preserves formatting** - maintains structure while adding connections
- **Sentence anchoring** - splits text into sentences with block references

#### 5. **Translate Spanish to English** (Alt + Shift + D)
Quick translation helper for comprehension and learning.

### 🎓 **Learning & Correction Commands**

#### 6. **Spanish Grammar Check & Homework Assistant** (Alt + Shift + E)
Quick exercise checking and corrections:
- **Fast validation** - Simple ✅ or corrections with `==word==`
- **Exercise support** - fill-in-gaps, translations, grammar checks
- **Concise feedback** - immediate answers for homework

#### 7. **Spanish Writing Tutor & Detailed Analysis** (Alt + Shift + K)
Comprehensive learning with detailed explanations:
- **In-depth corrections** with explanations under "Explicación"
- **Stylistic improvements** under "Mejora estilística" 
- **Educational feedback** - helps understand mistakes
- **Advanced grammar analysis**

## Smart Features

### **Intelligent Word Processing**
- **Ground form detection** - automatically identifies base forms (e.g., "pura" → "puro")
- **Capitalization handling** - `[[tengo|Tengo]]` for sentence-initial words
- **Context reuse** - reuses existing block references when adding multiple words from same paragraph
- **Dual linking** - connects both derived forms and base forms to context

### **Connected Knowledge Base**
- **Bidirectional linking** - connects word forms to base forms
- **Context anchoring** - enables easy navigation between source and definition
- **Graph visualization** - see connections between related words
- **Smart file organization** - optional sharded folder structure for large vocabularies

## Dictionary Entry Structure

Each dictionary entry follows a comprehensive format:

### **Header Section**
- **Emoji indicator**: 🔴 (feminine), 🔵 (masculine), 🟡 (verb), 🟢 (adjective)
- **Word + IPA**: `[[palabra]] /palaˈβɾa/`
- **Plural forms**: For nouns, includes gender variations

### **Core Sections**
1. **Context** - Real usage examples from your reading
2. **Synonyms & Related Words**
   - `=` Direct synonyms
   - `≈` Related/similar words  
   - `≠` Antonyms
3. **Translations** - English and other languages
4. **Morphological Breakdown** - `[[pre-]][[fix]][[o]]`
5. **Grammar Forms** - Full conjugation tables, plural forms, comparatives
6. **Related Words** - Word family and derivatives

## Setup

### Prerequisites
1. **Dedicated Vault Recommended** - The plugin creates many interconnected files
2. **API Key Required** - Google Gemini API key for AI-powered features
3. **Folder Organization** - Set up a dedicated folder (e.g., "words") for dictionary entries

### Installation
1. Install the plugin in Obsidian
2. Configure your Google Gemini API key in settings
3. Set your dictionary folder path (default: "words")
4. Optionally enable sharded file structure for large vocabularies

### Essential Hotkeys
The plugin provides these keyboard shortcuts:
- **Generate Dictionary Entry** (Alt + Shift + G) - Create comprehensive word definitions
- **Add Context to Dictionary** (Alt + Shift + C) - Add examples from reading material
- **Find Base Form** (Alt + Shift + I) - Identify infinitive/base forms
- **Normalize Selection** (Alt + Shift + S) - Process Spanish text with automatic linking
- **Translate Text** (Alt + Shift + D) - Quick translation assistance
- **Grammar Check** (Alt + Shift + E) - Fast homework checking
- **Writing Tutor** (Alt + Shift + K) - Detailed analysis and corrections

## Usage Workflow

### **Smart Context Addition Workflow**
This is the core feature that makes dictionary building effortless:

1. **Select unknown word** in Spanish text
2. **Run "Add Context to Dictionary"** (Alt + Shift + C)
3. **The plugin automatically**:
   - Wraps the word in brackets: `[[palabra]]`
   - Creates dictionary entry if it doesn't exist
   - Finds the base form and creates that entry too
   - Extracts the sentence containing the word
   - Adds a block reference anchor to the sentence
   - Adds the context to both the word and base form entries
   - Navigates to the dictionary entry

### **Advanced Text Processing**
1. **Select Spanish paragraphs** in reading material
2. **Run "Normalize Selection"** to automatically link all words
3. **Build interconnected knowledge base** through repeated use
4. **Use Graph View** to visualize word relationships

### **Learning and Correction**
- **Quick homework check** - Use "Spanish Grammar Check & Homework Assistant"
- **Detailed learning** - Use "Spanish Writing Tutor & Detailed Analysis"
- **Translation help** - Use "Translate Spanish to English" for comprehension

## Example Output

### Dictionary Entry
```markdown
🔵 [[gato]] /ˈɡato/ 

#forma-base #sustantivo

### Contexto
- *[[cuento-infantil#^1|^]]* El gato subió al tejado.
- *[[novela-española#^3|^]]* Los gatos duermen mucho.

### Sinónimos y Palabras Relacionadas
= [[felino]]
≈ [[mascota]], [[animal]]
≠ [[perro]]

### Traducciones
- **Inglés**: cat
- **Ruso**: кот

### Morfemas
[[gat]][[o]]

### Formas Gramaticales
- **Singular**: [[gato]] (masc), [[gata]] (fem)
- **Plural**: [[gatos]] (masc), [[gatas]] (fem)
- **Con artículo**: el [[gato]], la [[gata]]

### Palabras Relacionadas
- [[gatito]] (diminutive)
- [[gatuno]] (adjective)
- [[gatear]] (verb - to crawl)
```

### Context Addition
**Source file** (after adding context):
```markdown
El [[gato]] subió al tejado mientras los niños jugaban. ^1
```

**Dictionary entry** (context automatically added):
```markdown
### Contexto
- *[[cuento-infantil#^1|^]]* El gato subió al tejado mientras los niños jugaban.
```

## Network Usage

This plugin communicates with:
- **Google Gemini API** - For AI-powered dictionary generation, translation, and language analysis

Your API keys are stored securely in your Obsidian vault and are not shared with third parties.

## Configuration

### Settings
- **API Keys** - Google Gemini API key
- **Dictionary Folder** - Base folder for dictionary files (default: "words")
- **File Organization** - Enable/disable sharded folder structure
- **API Provider** - Currently supports Google Gemini

## Additional Documentation

- **[Technical Architecture](Diagrams.md)** - System architecture and workflow diagrams
- **[Development Backlog](Backlog.md)** - Current development tasks and completed features

## License

This plugin is licensed under the MIT License. See the `LICENSE` file for details.

## Disclaimer

This plugin is not affiliated with or endorsed by Google. Use of the Google Gemini API is subject to their terms of service.
