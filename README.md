# Supabase Database Manager

A Node.js CLI tool to interact with a [Supabase](https://supabase.com) database from the command line.
Supports **SELECT** (with filters, ordering, limits), **INSERT**, **UPDATE**, and **DELETE**
through the Supabase JavaScript client.

---

## Requirements

- Node.js ≥ 18
- A Supabase project (URL + API key)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your credentials:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-role-key
```

> **Tip:** Use the `service_role` key for full read/write access (keep it secret and never commit it).

---

## Usage

### Interactive menu (all operations)

```bash
npm start
# or
node src/index.js
```

This opens a full interactive menu where you can choose any operation.

### Standalone scripts (run a single operation directly)

| Command          | Script               | Description                |
|------------------|----------------------|----------------------------|
| `npm run select` | `node src/select.js` | Query data from a table    |
| `npm run insert` | `node src/insert.js` | Insert new record(s)       |
| `npm run update` | `node src/update.js` | Update existing record(s)  |
| `npm run delete` | `node src/delete.js` | Delete record(s)           |

---

## Operations

### SELECT

Query any table with optional filters, ordering and limits:

- Enter the target table name directly, e.g. `profiles`
- Choose columns (`*` for all, or e.g. `id, name, email`)
- Add **WHERE** filters with these operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in`
- Add **ORDER BY** (ASC / DESC)
- Add **LIMIT**

### INSERT

Insert one or multiple rows as a JSON object or array:

Enter the target table name directly before providing the payload.

```json
{"name": "Alice", "email": "alice@example.com"}
```

Bulk insert (array):

```json
[{"name": "Alice"}, {"name": "Bob"}]
```

### UPDATE

Update rows matching a column/value condition.

- Enter the target table name directly
- Provide the new column values as a JSON object
- Specify the filter column and value (e.g. `id` = `42`)

### DELETE

Delete rows matching a column/value condition.

- Enter the target table name directly
- Confirmation prompt before executing
- Optionally return the deleted rows

---

## Project structure

```text
.
├── .env.example          # Template for environment variables
├── package.json
└── src/
    ├── index.js          # Interactive menu (all operations)
    ├── select.js         # Standalone SELECT script
    ├── insert.js         # Standalone INSERT script
    ├── update.js         # Standalone UPDATE script
    ├── delete.js         # Standalone DELETE script
    ├── lib/
    │   ├── supabase.js   # Supabase client initialisation
    │   ├── display.js    # Table / error / success display helpers
    └── commands/
        ├── selectCmd.js  # SELECT logic
        ├── insertCmd.js  # INSERT logic
        ├── updateCmd.js  # UPDATE logic
        └── deleteCmd.js  # DELETE logic
```

---

## Dependencies

| Package | Purpose |
| --- | --- |
| `@supabase/supabase-js` | Supabase JavaScript client |
| `inquirer` | Interactive command-line prompts |
| `dotenv` | Load environment variables from `.env` |
| `chalk` | Coloured terminal output |
| `cli-table3` | Formatted table rendering |
