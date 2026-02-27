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
    if (!note?.filename) return "Error! No note selected on the sidebar?";

    const data = getNoteData(note.filename, note.content);
    const results = app.search(data.id)?.results ?? [];
    const backlinks = results
        .filter(l => !l.filename.startsWith(data.id))
        .map((l, i) => [getNoteData(l.filename, l.content), l.filename])
        .map(([d, f], i) => `${i+1}. ${d?.desc ?? "<no info>"} [[${d?.id ?? f}]]`)
        .join("\n") : "";

    return `# ${data?.desc ?? ""} (${data?.id ?? ""})\n## Backlinks\n\n${out}`;
}

output.display.content = parseBackLinks(input.notes.selected[0]);
