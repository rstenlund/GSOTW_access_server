# Express.js Supabase Server

A simple Express.js server for accessing Supabase database through GET requests.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

## Running the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Health Check

```
GET /
```

Returns server status.

### Get All Records

```
GET /api/:table
```

Fetches all records from the specified table.

**Example:**

```
GET /api/users
```

### Get Single Record by ID

```
GET /api/:table/:id
```

Fetches a single record by its ID.

**Example:**

```
GET /api/users/123
```

### Search with Filters

```
GET /api/search/:table?column=columnName&value=searchValue&limit=100
```

Search records with optional filters.

**Query Parameters:**

- `column` - Column name to filter by
- `value` - Value to match
- `limit` - Maximum number of records (default: 100)

**Example:**

```
GET /api/search/users?column=email&value=john@example.com&limit=10
```

## Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key
