# Implementation Plan: Code Folder Manager (Next.js + Neon)

## 1. What we're building

A web app where a user can:

1. Create a **folder** named `dept_year_batch_group` (e.g. `CSE_2024_B1_G3`)
2. Add **code files** inside it, each with a **heading** and **code content**
3. View, edit, delete, and copy the stored code

Everything is stored in Neon (serverless Postgres). Next.js handles both frontend and backend.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14/15 (App Router) + TypeScript | Frontend and backend in one project |
| Backend | Route Handlers (`app/api/...`) or Server Actions | No separate server needed |
| Database | Neon Postgres | Serverless, free tier, works well with Vercel |
| ORM | Drizzle ORM (or Prisma) with `@neondatabase/serverless` | Type-safe, lightweight |
| Validation | Zod | Validates folder name format and inputs |
| UI | Tailwind CSS + shadcn/ui | Fast, clean UI |
| Code editor | Monaco Editor (`@monaco-editor/react`) or CodeMirror | Syntax highlighting for the code box |
| Deploy | Vercel | Native Next.js support |

## 3. Database design

### `folders`

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | default `gen_random_uuid()` |
| name | text, **unique** | full name, e.g. `CSE_2024_B1_G3` |
| dept | text | parsed from name |
| year | int | parsed from name |
| batch | text | parsed from name |
| group_name | text | parsed from name |
| created_at | timestamptz | default `now()` |

### `code_files`

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| folder_id | uuid (FK → folders.id) | `ON DELETE CASCADE` |
| heading | text | title shown for the file |
| language | text | e.g. `python`, `java`, `cpp` |
| content | text | the code itself |
| created_at / updated_at | timestamptz | |

Indexes: `code_files(folder_id)`, and a unique index on `folders(name)`.

Storing dept/year/batch/group as separate columns (in addition to the full name) makes filtering easy, e.g. "show all CSE 2024 folders".

## 4. Folder name validation

Format: `dept_year_batch_group`. Use a Zod regex such as:

```
^[A-Za-z]+_\d{4}_[A-Za-z0-9]+_[A-Za-z0-9]+$
```

Options for the UI:

- **Single input** with live validation, or
- **Four separate fields** (Dept, Year, Batch, Group) that the app joins with `_`. This is less error-prone and is recommended.

Validate on both client and server.

## 5. API design

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/folders` | List folders (with optional `?dept=&year=` filters) |
| POST | `/api/folders` | Create a folder |
| DELETE | `/api/folders/[id]` | Delete folder and its files |
| GET | `/api/folders/[id]/files` | List files in a folder |
| POST | `/api/folders/[id]/files` | Add a code file (heading + code) |
| GET | `/api/files/[id]` | Get one file |
| PUT | `/api/files/[id]` | Update heading or code |
| DELETE | `/api/files/[id]` | Delete a file |

Return proper status codes: `409` for a duplicate folder name, `400` for validation errors, `404` for not found.

## 6. Pages and UI

```
/                      → Dashboard: folder list + search/filter + "New Folder"
/folders/[id]          → Folder view: list of files (heading, language, date) + "Add File"
/folders/[id]/new      → Form: heading, language dropdown, code editor
/files/[id]            → View code with syntax highlighting, Copy / Edit / Delete
/files/[id]/edit       → Edit form
```

Key components: `FolderCard`, `CreateFolderDialog`, `FileList`, `CodeEditor`, `CodeViewer`, `ConfirmDeleteDialog`.

## 7. Project structure

```
/app
  /api/folders/route.ts
  /api/folders/[id]/route.ts
  /api/folders/[id]/files/route.ts
  /api/files/[id]/route.ts
  /folders/[id]/page.tsx
  /files/[id]/page.tsx
  page.tsx
/components
/db
  schema.ts
  index.ts          # Neon connection
/lib
  validators.ts     # Zod schemas
drizzle.config.ts
.env.local          # DATABASE_URL
```

## 8. Step-by-step phases

### Phase 1: Setup

1. `npx create-next-app@latest` (TypeScript, Tailwind, App Router)
2. Create a Neon project and copy the connection string into `.env.local` as `DATABASE_URL`
3. Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `zod`

### Phase 2: Database

1. Write the schema in `db/schema.ts`
2. Run `drizzle-kit generate` and `drizzle-kit migrate` (or `push`)
3. Verify the tables in the Neon console

### Phase 3: Backend

1. Build Zod validators
2. Implement the folder endpoints, then the file endpoints
3. Test with Postman or Thunder Client

### Phase 4: Frontend

1. Dashboard and create-folder dialog
2. Folder page and file list
3. Add/edit file form with the code editor
4. File viewer with syntax highlighting and a copy button

### Phase 5: Polish

1. Loading and error states, toasts
2. Search and filter by dept/year/batch/group
3. Responsive layout and dark mode

### Phase 6: Deploy

1. Push to GitHub and import into Vercel
2. Add `DATABASE_URL` in Vercel env vars
3. Run the migration against the production Neon branch

## 9. Things to decide early

- **Authentication:** Is this public, or do students/teachers need to log in? If you need roles, add NextAuth/Auth.js or Clerk and an `owner_id` on folders.
- **Duplicate handling:** Should creating an existing folder name show an error or open the existing folder?
- **File size limit:** Cap code content (e.g. 100 KB) to keep the DB lean.
- **Uploads:** Paste code only, or also upload `.py`/`.java` files and read them into the editor?
- **Versioning:** Optional later feature, keeping edit history of each file.

## 10. Stretch features

- Download a folder as a `.zip`
- Full-text search across headings and code
- Tags and pagination
- Share links (read-only)
