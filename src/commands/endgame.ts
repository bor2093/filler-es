import { Editor, Notice, TFile } from 'obsidian';
import TextEaterPlugin from '../main';
import { makeGrundformsPrompt } from 'prompts/endgame/prompts/grundforms/grundformsPrompt';
import { grundformsOutputSchema } from 'prompts/endgame/zod/schemas';
import { Grundform, Wortart, Nomen, Genus } from 'prompts/endgame/zod/types';

// merge objects into one (by dumoing emojies from one object to another) if the grundform is the same:
// adj + adj = adj
// adj + adv = adj
// verb + verb = verb
// verb + PartizipialesAdjektiv = verb
// nom + nom (if the same gender)
// rest -- unmerged

// format

// join nomens with |
// 🏞 <span class="custom-color-for-der">der</span> [[See]] | 🌊 <span class="custom-color-for-die">die</span> [[See]]
// 🏰 | 🔒 <span class="custom-color-for-das">das</span> [[Schloss]]  

// verbForms: [["melkt", "milkt"], ["molk"], ["gemelkt", "gemolken"]],


const formatEmoji = (g: Grundform) => `${g.emojiBeschreibungs.join(" | ")}`;
const formatNomGenus = (g: Nomen) => {
    switch (g.genus) {
        case Genus.Feminin:
            return `<span class="custom-color-for-die">die</span>`;
        case Genus.Neutrum:
            return `<span class="custom-color-for-das">das</span>`;
        case Genus.Maskulin:
            return `<span class="custom-color-for-der">der</span>`;
    }
};

const grundformWortartFromGrundform = (g: Grundform) => {
    return g.wortart === Wortart.PartizipialesAdjektiv ? Wortart.Verb : g.wortart;
};

const formattedWortartFromWortart = (w: Wortart) => {
    return `*${w}*`
};

const formatLinkToGrundformNote = (g: Grundform, noteForGrundformIsAlreadyCreated: boolean) => {
    const ok = noteForGrundformIsAlreadyCreated;

    if (g.grundform.length < 2) {
        return ok ? `[[${g.grundform}]]` : "";
    }

    switch (g.wortart) {
        case Wortart.Unbekannt:
            return "";   
        case Wortart.Praefix:
            return `[[Grammatik/Morphem/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        case Wortart.Praeposition:
            return `[[Grammatik/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        case Wortart.Pronomen:
            return `[[Grammatik/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        case Wortart.Konjunktion:
            return `[[Grammatik/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        case Wortart.Partikel:
            return `[[Grammatik/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        case Wortart.Artikel:
            return `[[Grammatik/${g.wortart}/List/${g.grundform} (${g.wortart})|${g.grundform}]]`;
        default:
            return ok ? `[[${g.grundform}]]` : `[[Worter/Grundform/${grundformWortartFromGrundform(g)}/${g.grundform[0]}/${g.grundform[1]}/${g.grundform}|${g.grundform}]]`
}};

const formatGrundform = (g: Grundform, noteForGrundformIsAlreadyCreated: boolean) => {
    const ok = noteForGrundformIsAlreadyCreated;

    switch (g.wortart) {
        case Wortart.Unbekannt:
            return g.comment;   
        case Wortart.Nomen:
            return `${formatEmoji(g)} ${formatNomGenus(g)} ${formatLinkToGrundformNote(g, ok)}`
        default:
            return `${formatEmoji(g)} ${formatLinkToGrundformNote(g, ok)} ${formattedWortartFromWortart(grundformWortartFromGrundform(g))}`
    }
};

async function doesGrundformNoteExist(plugin: TextEaterPlugin, file: TFile, g: Grundform) {
    const targetFile = plugin.app.metadataCache.getFirstLinkpathDest(g.grundform, file.path);
    return !!targetFile;
};

async function endgameInfCase(plugin: TextEaterPlugin, file: TFile, grundforms: Grundform[]) {
    // merge objects into one (by dumoing emojies from one object to another) if the grundform is the same:
    // adj + adj = adj
    // adj + adv = adj
    // verb + verb = verb
    // verb + PartizipialesAdjektiv = verb
    // nom + nom (if the same gender)
    // rest -- unmerged

    // keep formatting untouched
    const linksPromises = grundforms.map(async (g) => {
        const exists = await doesGrundformNoteExist(plugin, file, g);
        return formatGrundform(g, exists);
    });

    // join formatted nomens with diff gender with |
    // example:
    // 🏞 <span class="custom-color-for-der">der</span> [[See]] | 🌊 <span class="custom-color-for-die">die</span> [[See]]
    const links = (await Promise.all(linksPromises)).join("\n");
    
    await plugin.fileService.appendToFile(file.path, links);
};

export default async function endgame(plugin: TextEaterPlugin, editor: Editor, file: TFile) {
    const word = file.basename.toLocaleLowerCase();
    try {
        const grundformsPrompt = makeGrundformsPrompt();
        const dictionaryEntry = await plugin.apiService.generateContent(grundformsPrompt, word, true);

        const parsed = grundformsOutputSchema.safeParse(JSON.parse(dictionaryEntry));
        
        if (parsed.error) {
            console.error({zodError: parsed.error, output: dictionaryEntry});
            await plugin.fileService.appendToFile(file.path, "Contact t.me/@clockblocker");
            return;
        }

        const grundforms = parsed.data.map(({rechtschreibung, grundform, ...rest}) => ({rechtschreibung, grundform, ...rest, isGrundform: word === rechtschreibung && rechtschreibung === grundform})).sort(({isGrundform}) => isGrundform ? 1 : 0);
        if (!grundforms.some(({isGrundform}) => isGrundform)) {
            await endgameInfCase(plugin, file, parsed.data)
        }
        
        console.log('grundforms', grundforms);
    } catch (error) {
        new Notice(`Error: ${error.message}`);
    }
};

