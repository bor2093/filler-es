## 🏗️ Architecture Diagram

```mermaid 
graph TD
    A["🧑‍💻 User"] --> B["📝 Obsidian Editor"]
    B --> C["🔌 TextEaterPlugin"]
    
    C --> D["⚙️ Services"]
    D --> E["🤖 ApiService<br/>(Google Gemini AI)"]
    D --> F["📁 FileService<br/>(File Operations)"]
    
    C --> G["🎯 Commands"]
    G --> H["📖 fillTemplate<br/>(Generate Dictionary)"]
    G --> I["🔗 addBacklinks<br/>(Create Links)"]
    G --> J["🌐 translateSelection<br/>(Translate Text)"]
    G --> K["📏 normalizeSelection<br/>(Normalize Forms)"]
    
    E --> L["📝 Prompts"]
    L --> M["📚 Dictionary Entry"]
    L --> N["🔤 Grammar Forms"]
    L --> O["🧬 Morphemes"]
    L --> P["🎭 Valence"]
    
    H --> Q["📄 Generated Entry"]
    Q --> R["💾 Obsidian Vault"]
```

## 🔄 Main Workflow: Dictionary Entry Generation

```mermaid
sequenceDiagram
    participant U as User
    participant O as Obsidian
    participant P as Plugin
    participant AI as Google Gemini
    participant V as Vault
    
    U->>O: Opens file "bailar.md"
    U->>O: Runs "Generate Dictionary Entry" command
    O->>P: fillTemplate(word: "bailar")
    
    Note over P,AI: Parallel AI requests
    P->>AI: Generate dictionary entry
    P->>AI: Generate grammar forms
    P->>AI: Generate morphemes
    P->>AI: Generate valence patterns
    
    AI-->>P: Dictionary data
    AI-->>P: Conjugation table
    AI-->>P: Morpheme breakdown
    AI-->>P: Verb patterns
    
    P->>P: Combine all sections
    P->>P: Add YouGlish pronunciation link
    P->>P: Format with subheadings
    
    P->>V: Write complete entry to file
    P->>O: Display success notification
```

## 📚 Dictionary Entry Structure
```mermaid
graph TD
    A[Word Input] --> B[fillTemplate.ts]
    B --> C[baseDict.ts]
    B --> D[morphems.ts] 
    B --> E[valence.ts]
    B --> F[generate-forms.ts]
    
    C --> G[Header + 4 Core Sections]
    D --> H[Morfemas]
    E --> I[Valencia]
    F --> J[Formas Gramaticales]
    F --> K[Formas Adjetivales]
    
    G --> L[Final Dictionary Entry]
    H --> L
    I --> L
    J --> L
    K --> L
```

## 🔗 Add Context Command Workflow

```mermaid
flowchart TD
    A["User selects word in text and calls Add Context command"] --> B["Clean up nested brackets from selected word"]
    
    B --> C["Extract context sentence containing the selected word"]
    
    C --> D["Normalize capitalization detect proper nouns vs sentence-start"]
    
    D --> E["Create link format and replace selection"]
    
    E --> F{"Dictionary entry exists for word?"}
    
    F -->|No| G["Create dictionary file and auto-generate entry using fillTemplate"]
    F -->|Yes| H["Dictionary file exists"]
    
    G --> I["Determine if word is ground form using AI"]
    H --> I
    
    I --> J["Create block reference in source document"]
    
    J --> K["Add context link prefix to sentence"]
    
    K --> L["Add block reference suffix to end of paragraph"]
    
    L --> M{"Is selected word in ground form?"}
    
    M -->|Yes| N["Add context entry to selected word Context section"]
    M -->|No| O["Get ground form using AI"]
    
    O --> P["Ensure ground form dictionary entry exists"]
    
    P --> Q["Add context entry to BOTH selected word and ground form Context sections"]
    
    N --> R["Switch to dictionary entry file"]
    Q --> R
    
    R --> S["Complete: Word linked, context added, file opened"]
    
    style A fill:#e1f5fe
    style S fill:#e8f5e8
    style F fill:#fff3e0
    style M fill:#fff3e0
    style G fill:#ffebee
    style J fill:#fce4ec
    style K fill:#fce4ec
    style L fill:#fce4ec
```

### 🔍 Key Features of Add Context Command:

1. **Smart Capitalization Handling**: Detects proper nouns vs sentence-start capitalization
2. **Context Sentence Extraction**: Uses cursor position to find the most relevant sentence
3. **Automatic Dictionary Generation**: Creates full dictionary entries when needed
4. **Block Reference System**: Creates numbered anchors with context links
5. **Ground Form Detection**: Uses AI to determine canonical word forms
6. **Dual Context Addition**: Adds context to both inflected and ground forms
7. **Automatic Navigation**: Opens the dictionary entry after completion

### 📝 Context Entry Format:
```
- *[[SourceFile#^contextN|^]]* Context sentence containing the word...
```

## 🔗 Backlink System & Word Network

```mermaid
graph LR
    A["🎯 bailar<br/>(infinitive)"] --> B["💃 bailaste<br/>(past tense)"]
    A --> C["🎭 bailando<br/>(gerund)"]
    A --> D["✅ bailado<br/>(participle)"]
    
    A --> E["👨 bailarín<br/>(dancer-masc)"]
    A --> F["👩 bailarina<br/>(dancer-fem)"]
    A --> G["🎪 baile<br/>(dance-noun)"]
    
    H["📚 Current File<br/>Spanish Text"] --> I["👤 User Action"]
    I --> J["🔗 Create Links<br/>[[bailar]], [[música]]"]
    I --> K["🎯 Run 'Populate' Command"]
    
    K --> L["✨ Auto-create Files"]
    L --> A
    L --> M["🎵 música"]
    L --> N["🎶 cantar"]
    
    O["⬅️ Backlinks Added"] --> A
    O --> M
    O --> N
    
    style A fill:#4caf50,color:#fff
    style H fill:#2196f3,color:#fff
    style L fill:#ff9800,color:#fff

``` 