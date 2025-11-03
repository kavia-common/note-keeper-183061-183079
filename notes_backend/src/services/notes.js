const { randomUUID } = require('crypto');

/**
 * NotesService manages note entities in memory.
 * In production, this can be swapped to use a database.
 */
class NotesService {
  constructor() {
    // In-memory storage for notes
    this.notes = [];
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note with title and content.
   * @param {object} payload
   * @param {string} payload.title - Required title of the note
   * @param {string} [payload.content] - Optional content of the note
   * @returns {object} The created note
   */
  create({ title, content = '' }) {
    const now = new Date().toISOString();
    const note = {
      id: randomUUID(),
      title: String(title),
      content: String(content || ''),
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  // PUBLIC_INTERFACE
  /**
   * Get all notes.
   * @returns {object[]} Array of notes
   */
  getAll() {
    return this.notes;
  }

  // PUBLIC_INTERFACE
  /**
   * Get a note by id.
   * @param {string} id
   * @returns {object|null} The note or null
   */
  getById(id) {
    return this.notes.find((n) => String(n.id) === String(id)) || null;
  }

  // PUBLIC_INTERFACE
  /**
   * Update a note's title and/or content by id.
   * @param {string} id
   * @param {object} payload
   * @param {string} [payload.title]
   * @param {string} [payload.content]
   * @returns {object|null} The updated note or null if not found
   */
  update(id, { title, content }) {
    const idx = this.notes.findIndex((n) => String(n.id) === String(id));
    if (idx === -1) return null;
    const note = this.notes[idx];
    if (typeof title !== 'undefined') {
      note.title = String(title);
    }
    if (typeof content !== 'undefined') {
      note.content = String(content);
    }
    note.updatedAt = new Date().toISOString();
    this.notes[idx] = note;
    return note;
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by id.
   * @param {string} id
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    const before = this.notes.length;
    this.notes = this.notes.filter((n) => String(n.id) !== String(id));
    return this.notes.length < before;
  }
}

module.exports = new NotesService();
