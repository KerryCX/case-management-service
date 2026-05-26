# Case Management Service

RESTful API for managing caseworker cases. Built with Node.js, Express, and TypeScript.

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

## Test

```bash
npm test           # run tests with coverage
npm run test:watch # watch mode
```

## API

Base URL: `http://localhost:3000`

| Method | Path       | Description                          |
| ------ | ---------- | ------------------------------------ |
| GET    | /cases     | List all cases (supports `?status=`) |
| GET    | /cases/:id | Get a single case                    |
| POST   | /cases     | Create a case                        |
| PATCH  | /cases/:id | Update a case                        |
| DELETE | /cases/:id | Delete a case                        |
