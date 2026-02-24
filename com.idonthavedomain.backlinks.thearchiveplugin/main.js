/* Backlinks overview plugin for "The Archive" app

License: CC-BY-4.0
Author: JW

*/

"use strict";

const currentNote = input.notes.selected[0].filename;
const regexId = new RegExp(/^([0-9]{8,14}|^.*?)(\s.*|$)/);
const regexNoteHeader = new RegExp("(?<=^|\\n)# (.+)\\n");
const currentNoteId = getCurrentNoteId();


function extractHeader(noteContent)
{
    const contentMatch = noteContent.match(regexNoteHeader);
    return contentMatch ? contentMatch[1] : null;
}

function getCurrentNoteId()
{
    const matchId = currentNote.match(regexId);

    if (!matchId)
        cancel("Could not parse ID from the current note's filename!");
    return matchId[1];
}

function parseBacklinks()
{
    let outputText = "";
    const searchResults = app.search(currentNoteId);

    let idx = 0;
    for(const note of searchResults.results)
    {
        let noteId = note.filename;
        let noteFileHeader;
        let noteHeader = extractHeader(note.content);;

        // Don't include current file in the results
        if (note.filename == currentNote)
            continue;

        const matchNoteId = note.filename.match(regexId);

        if (matchNoteId)
        {
            noteId = matchNoteId[1];
            noteFileHeader = matchNoteId[2].replace(" ", "");
        }

        if (noteFileHeader)
            noteHeader = noteFileHeader;
        else
            if (noteHeader === null)
                noteHeader = "<No header or file description available>";

        const textLine = `${idx+1}. ${noteHeader} [[${noteId}]]\n`;

        outputText += textLine;
        idx++;
    }

    return outputText;
}


output.display.content = `# Backlinks for "${currentNote}"\n\n${parseBacklinks()}`;

