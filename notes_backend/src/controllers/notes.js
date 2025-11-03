const notesService = require('../services/notes');

class NotesController {
  /**
   * Validate create/update payloads for notes.
   * - For create: require title (non-empty string).
   * - For update: at least one of title/content must be present if provided, and types must be strings if present.
   * @param {object} body
   * @param {boolean} isCreate
   * @returns {{valid:boolean, message?:string}}
   */
  static validateBody(body, isCreate = false) {
    if (!body || typeof body !== 'object') {
      return { valid: false, message: 'Request body must be a JSON object' };
    }
    if (isCreate) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return { valid: false, message: 'Field "title" is required and must be a non-empty string' };
      }
      if (typeof body.content !== 'undefined' && typeof body.content !== 'string') {
        return { valid: false, message: 'Field "content" must be a string if provided' };
      }
      return { valid: true };
    }
    // Update
    const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
    const hasContent = Object.prototype.hasOwnProperty.call(body, 'content');
    if (!hasTitle && !hasContent) {
      return { valid: false, message: 'At least one of "title" or "content" must be provided' };
    }
    if (hasTitle && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      return { valid: false, message: 'If provided, "title" must be a non-empty string' };
    }
    if (hasContent && typeof body.content !== 'string') {
      return { valid: false, message: 'If provided, "content" must be a string' };
    }
    return { valid: true };
  }

  // PUBLIC_INTERFACE
  /**
   * GET /api/notes - list all notes
   */
  list(req, res) {
    const notes = notesService.getAll();
    return res.status(200).json(notes);
  }

  // PUBLIC_INTERFACE
  /**
   * GET /api/notes/:id - get note by id
   */
  get(req, res) {
    const { id } = req.params;
    const note = notesService.getById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(200).json(note);
  }

  // PUBLIC_INTERFACE
  /**
   * POST /api/notes - create a new note
   */
  create(req, res) {
    const validation = NotesController.validateBody(req.body, true);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    const { title, content = '' } = req.body;
    const created = notesService.create({ title, content });
    return res.status(201).json(created);
  }

  // PUBLIC_INTERFACE
  /**
   * PUT /api/notes/:id - update a note
   */
  update(req, res) {
    const { id } = req.params;
    const validation = NotesController.validateBody(req.body, false);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    const updated = notesService.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(200).json(updated);
  }

  // PUBLIC_INTERFACE
  /**
   * DELETE /api/notes/:id - delete a note
   */
  delete(req, res) {
    const { id } = req.params;
    const ok = notesService.delete(id);
    if (!ok) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(204).send();
  }
}

module.exports = new NotesController();
