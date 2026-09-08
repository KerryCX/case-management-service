# Case Management Service

Full-stack case management app: a RESTful API (Node.js, Express, TypeScript) with a React + TypeScript client in `client/`.

## Setup

```bash
npm install         # installs the API's dependencies
cd client && npm install   # installs the client's dependencies
```

## Run (development)

Two servers, in two terminals:

```bash
npm run dev                 # API, with hot reload, on http://localhost:3000
```

```bash
cd client && npm run dev    # client, with hot reload, on http://localhost:5173
```

Open `http://localhost:5173`. The client's dev server forwards `/cases` and `/health` requests to the API on port 3000 (see `client/vite.config.ts`), so there's no CORS setup to think about.

## Run (as one combined app)

Build the client, then start the API, which serves the built client itself:

```bash
cd client && npm run build  # outputs client/dist
cd ..
npm run build               # compiles the API
npm start                   # serves both from http://localhost:3000
```

Now `http://localhost:3000` shows the app directly instead of `Cannot GET /`. This is the shape you'd deploy: one server, one port.

## Deploying

`npm run build` builds the client and the API together (it installs the client's dependencies, builds it, then compiles the API), so a host that just runs `npm install && npm run build && npm start` will work with no extra configuration. The server already reads `PORT` from the environment, falling back to 3000 locally, which is what most Node hosts (Render, Railway, Fly.io) expect.

One thing to know before relying on a deployed copy: cases are stored in memory only, there's no database. Any restart, redeploy, or the server sleeping on a free tier wipes all cases back to empty. Fine for a live demo, not for anything you need to persist.

## Test

```bash
npm test           # API tests, with coverage
npm run test:watch # watch mode
```

The client doesn't have its own test suite yet.

## Using the API directly

The client covers day-to-day use, but the API can still be called directly if you want to script something or use Postman/Insomnia. A browser address bar can only send GET requests, so you can view `/cases` and `/cases/:id` just by typing the URL in, creating, updating, or deleting a case needs a tool that can send POST/PATCH/DELETE requests, `curl` in a terminal being the simplest.

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

| Field       | Type                                | Required? | Notes                |
| ----------- | ----------------------------------- | --------- | -------------------- |
| `id`        | string                              | No        | Generated, read-only |
| `title`     | string                              | Yes       | Non-empty            |
| `status`    | `open` \| `in-progress` \| `closed` | No        | Defaults to `open`   |
| `priority`  | `low` \| `medium` \| `high`         | No        | Defaults to `medium` |
| `assignee`  | string or `null`                    | No        | Defaults to `null`   |
| `createdAt` | ISO timestamp                       | No        | Generated, read-only |
| `updatedAt` | ISO timestamp                       | No        | Generated, read-only |

### Errors

Invalid input (missing `title`, or a `status`/`priority` outside the allowed values) returns `400` with a `message` explaining what's wrong. A request for a case `id` that doesn't exist returns `404` with `{"message":"Case not found"}`.
