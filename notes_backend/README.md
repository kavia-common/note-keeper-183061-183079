# Notes Backend (Express)

Simple Notes CRUD REST API with in-memory storage.

- Default port: 3001 (override with PORT env)
- Docs: /docs (Swagger UI)
- Health: GET /health

## Run

- Development (watch): npm run dev
- Production: npm start

The app listens on PORT environment variable if set; otherwise uses 3001.

## Endpoints

- GET /api/notes
  - List all notes
- GET /api/notes/:id
  - Get a single note by ID
- POST /api/notes
  - Create a note
  - Body: { "title": "string", "content": "string (optional)" }
- PUT /api/notes/:id
  - Update title/content
  - Body: { "title": "string (optional)", "content": "string (optional)" }
- DELETE /api/notes/:id
  - Delete a note by ID
- GET /health
  - Health check { status: "ok" }

## Examples (curl)

- Create:
  curl -s -X POST http://localhost:3001/api/notes \
    -H "Content-Type: application/json" \
    -d '{"title":"First note","content":"Hello"}'

- List:
  curl -s http://localhost:3001/api/notes

- Get by id:
  curl -s http://localhost:3001/api/notes/<id>

- Update:
  curl -s -X PUT http://localhost:3001/api/notes/<id> \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated title"}'

- Delete:
  curl -s -X DELETE http://localhost:3001/api/notes/<id> -i

## Validation and Errors

- POST requires "title" as a non-empty string. "content" optional.
- PUT requires at least one of "title" or "content".
- 400 returned for invalid input, 404 for missing note.

## Notes

- Storage is in-memory for preview convenience; restarting the server clears notes.
- Add a persistent database by swapping the service implementation in src/services/notes.js.
