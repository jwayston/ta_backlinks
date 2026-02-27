/* Backlinks overview plugin for "The Archive" app

License: CC-BY-4.0
Author: JW

*/

"use strict";


const getHeader = content => 
    content.match(/(?:^|\n)# (.+)/)?.[1] ?? "<No H1 header>";

const getNoteData = (filename, content) => {
    const [_, id, desc] = filename.match(/^(\d{6,}\S*)\s*(.*)/) ?? [];
    return id ? { id, desc: desc.trim() || getHeader(content) } : null;
}

const parseBackLinks = (note) => {
    if (!note?.filename) return "<Error in note object data>";

    const data = getNoteData(note.filename, note.content ?? "");
    const results = data?.id ? app.search(data.id)?.results : null;

    return Array.isArray(results) ? results
        .filter(l => !l.filename.startsWith(data.id))
        .map((l, i) => {
            const d = getNoteData(l.filename, l.content);
            return `${i+1}. ${d?.desc ?? "<no description>"} [[${d?.id ?? l.filename}]]`;
        }).join("\n") : "";
}


const note = input.notes.selected[0];
if (!note) cancel("Make sure the note is selected on the side bar");
const data = getNoteData(note.filename, note.content);

output.display.content = 
    `# ${data?.desc ?? ""} (${data?.id ?? ""})\n## Backlinks\n\n` + parseBackLinks(note);

