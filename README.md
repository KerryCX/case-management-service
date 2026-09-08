# Case Management Service

RESTful API for managing caseworker cases. Built with Node.js, Express, and TypeScript.

This is a JSON API with no web page attached. Visiting `http://localhost:3000/` in a browser will show `Cannot GET /`, that's expected, there's no route for the root path. See "Using the API" below for how to actually talk to it.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev        # development (hot reload)
npm run build      # compile TypeScript
npm start          # run compiled output
```

The server runs at `http://localhost:3000`.

## Test

```bash
npm test           # run tests with coverage
npm run test:watch # watch mode
```

## Using the API

A browser address bar can only send GET requests, so you can view `/cases` and `/cases/:id` just by typing the URL in. Creating, updating, or deleting a case needs a tool that can send POST/PATCH/DELETE requests, `curl` in a terminal, or a GUI client like Postman, Insomnia, or the Thunder Client extension in VS Code.

With the server running, here's the full flow using `curl`:

**List all cases**

```bash
curl http://localhost:3000/cases
```

Filter by status:

```bash
curl "http://localhost:3000/cases?status=open"
```

**Create a case**

```bash
curl -X POST http://localhost:3000/cases \
  -H "Content-Type: application/json" \
  -d '{"title":"New case","status":"open","priority":"high"}'
```

Only `title` is required, `status` defaults to `open`, `priority` defaults to `medium`, `assignee` defaults to `null`. The response includes the generated `id`, use it for the next two.

**Get a single case**

```bash
curl http://localhost:3000/cases/THE_ID
```

**Update a case**

```bash
curl -X PATCH http://localhost:3000/cases/THE_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"closed"}'
```

Send only the fields you want to change.

**Delete a case**

```bash
curl -X DELETE http://localhost:3000/cases/THE_ID
```

## API reference

Base URL: `http://localhost:3000`

| Method | Path       | Description                          |
| ------ | ---------- | ------------------------------------ |
| GET    | /cases     | List all cases (supports `?status=`) |
| GET    | /cases/:id | Get a single case                    |
| POST   | /cases     | Create a case                        |
| PATCH  | /cases/:id | Update a case                        |
| DELETE | /cases/:id | Delete a case                        |

### Case fields

| Field       | Type                                 | Required? | Notes                 |
| ----------- | ------------------------------------ | --------- | --------------------- |
| `id`        | string                               | No        | Generated, read-only  |
| `title`     | string                               | Yes       | Non-empty             |
| `status`    | `open` \| `in-progress` \| `closed`  | No        | Defaults to `open`    |
| `priority`  | `low` \| `medium` \| `high`          | No        | Defaults to `medium`  |
| `assignee`  | string or `null`                     | No        | Defaults to `null`    |
| `createdAt` | ISO timestamp                        | No        | Generated, read-only  |
| `updatedAt` | ISO timestamp                        | No        | Generated, read-only  |

### Errors

Invalid input (missing `title`, or a `status`/`priority` outside the allowed values) returns `400` with a `message` explaining what's wrong. A request for a case `id` that doesn't exist returns `404` with `{"message":"Case not found"}`.
