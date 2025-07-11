---

kanban-plugin: board

---

## Backlog

- [ ] Disable switch to the dict entry by default (configurable) - check how it works with tooltips
- [ ] Non-ground form entry:
	- [ ] translation
	- [ ] grammar attributes: tense, person, mood
- [ ] Ground-form entry - reorder sections
	- [ ] contextes
	- [ ] grammar attributes 
	- [ ] translation
- [ ] Omonyms management
	- [ ] fuera
	- [ ] como
- [ ] Fix bug with detection of speech part
	- [ ] dignamente
- [ ] Support idiomas
- [ ] Support of reflexive verbs
- [ ] Color markdown for genders
- [ ] Switch immediately to normal form (possibly)
- [ ] Add link immediately to normal form (possibly)
- [ ] Split big blocks into sentences (possibly)
- [ ] Are "block" and "sentence" the same things in terms of context?
- [ ] Fix bug with identifyng context for tables (1000 palabras)
- [ ] Update documentation and diagrams
- [ ] Make true multilingual support
- [ ] Use Oxford dict API
	- [ ] Add grammatic metainfo for non-ground forms
	- [ ] Add translation for non-ground forms (possibly)
	- [ ] Precise part of speech recognition (ser)
	- [ ] Oronyms management (el, como, fuera)


## In progress



## Done

**Выполнено**


***

## Архивировать

- [x] Fix bugs when extra content is added to context
- [x] Use ! for contexts
- [x] Add version control for dictionary (git)
- [x] Remove all unnecessary code and commands
- [x] Fix readme
- [x] For verbs add link to https://www.elconjugador.com/conjugacion/verbo/ser.html
- [x] Cluster graph vertices
	- [x] Content
		- [x] Song
		- [x] Subtitles
		- [x] Article
		- [x] Book
		- [x] ...
	- [x] Word
		- [x] Base form
		- [x] Non-base form
		- [x] Part of speech
- [x] Create dictionary entry by template(s)
	- [x] headers
- [x] Populate command - replaced with block backlinks list
	- [x] separate command output from rest of the article
	- [x] no annoying comma at the beginning
- [x] Add backlinks or forward links between content and base form
- [x] Implement adding context to dictionary entry. Preferably with 1st super command
	- [x] Improve context string so you can copy the line directly from content to dictionary entry
	- [x] For capitalized words lead to page with lowercase
	- [x] Bug: sometimes anchor is written in capital letters
	- [x] Bug: sometimes anchor is placed who knows where
	- [x] Bug: sometimes link sends you to wrong place
	- [x] Bug: pura
	- [x] Switch to created dictionary entry
	- [x] Bug: add links to ground forms

%% kanban:settings
```
{"kanban-plugin":"board","new-card-insertion-method":"prepend","show-checkboxes":true,"lane-width":350,"full-list-lane-width":true}
```
%%