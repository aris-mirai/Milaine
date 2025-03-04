import { INote } from '../../../models/note';
import { toHtml } from '../../../mfm/to-html';
import { parseFull } from '../../../mfm/parse';

export function getNoteHtml(note: INote) {
	let html = toHtml(parseFull(note.text), note.mentionedRemoteUsers);
	if (html == null) html = '<p>.</p>';

	return html;
}
