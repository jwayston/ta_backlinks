/* Backlinks overview plugin for "The Archive" app

License: CC-BY-4.0
Author: JW

*/

"use strict";

const LINEBR = "\n";
const idRegex = new RegExp(/^([0-9]{10,12})/);
const noteHeaderRegexp = new RegExp("^# (.+)\\n");

function extractHeader(noteContent)
{
    const contentMatch = noteContent.match(noteHeaderRegexp);
    if (contentMatch)
    {
        return contentMatch[1];
    }
    else
    {
        return "<No detectable H1 header found>";
    }
}

const currentNote = input.notes.selected[0].filename;
const idMatch = currentNote.match(idRegex);

if (!idMatch)
{
	cancel("Could not parse ID from the current note's filename!");
}


let outputText = "";
const currentNoteId = idMatch[1];
const searchResults = app.search(currentNoteId);

let idx = 1;
searchResults.results.forEach(elem => 
{
	// Don't include current file in the results
	if (elem.filename == currentNote) return;

	let noteId = elem.filename;
	const noteIdMatch = elem.filename.match(idRegex);
	
	if (noteIdMatch)
	{
		noteId = noteIdMatch[1];
	}

	const noteHeader = extractHeader(elem.content);
	const textLine = `${idx}. [[${noteId}]] ${noteHeader}\n`;

	outputText += textLine;
	idx++;
});

output.display.content = `# Backlinks for "${currentNoteId}"\n\n${outputText}`;