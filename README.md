# Calendar App

A simple calendar application built as a SPA with theme switching.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express + TypeScript
- **Database**: SQLite (better-sqlite3)

## Features

- Monthly calendar view
- Add, edit, delete events
- Theme switching (Light, Dark, Ocean, Forest)

## Getting Started

### Install dependencies

```bash
npm run install:all
```

### Development

Run both frontend and backend:

```bash
npm run dev
```

Or run separately:

```bash
# Backend (port 3001)
npm run dev:server

# Frontend (port 5173)
npm run dev:client
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all events |
| GET | /api/events/:id | Get single event |
| POST | /api/events | Create event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |
