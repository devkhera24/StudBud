# StudBud — AI Powered Study Companion

StudBud is a React-based study companion to help you organize subjects/topics, manage tasks and deadlines, plan revisions, and generate quick study helpers from your notes.

## Features

- Dashboard overview
- Subjects + Topics (status, difficulty, notes)
- Tasks (deadlines, priority, completion)
- Revision Planner (calendar + reschedule + overdue view)
- AI Tools (summary / flashcards / quiz generation)

## Quick start

### Install

```bash
npm install
```

### Run (dev)

```bash
npm start
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Data persistence

- App data is stored in your browser via `localStorage` under the key `study_companion_v1`.
- On first run, the app loads sample seed data; after that, your changes persist across refresh.
- To reset the app to a clean state, clear that key from browser storage.

## How revisions are added

- When you mark a Topic as **Completed**, the app automatically schedules a revision for **+3 days**.
- You can manage scheduled revisions in the **Revision Planner** (mark revised, reschedule, delete).

## AI Tools (API key?)

- The current AI Tools output is generated locally (no network calls), so **no API key is required**.
- If you want “real AI” (OpenAI / Azure OpenAI), you should add a backend/proxy so secrets are not exposed in the browser.

## Tech

- React (Create React App)
- React Router
- Context state + `localStorage`
- date-fns

