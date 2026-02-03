import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', 'calendar.db');
const db: DatabaseType = new Database(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      startTime TEXT,
      endTime TEXT,
      color TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create index for faster date queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)
  `);

  console.log('Database initialized successfully');
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color?: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
}

// Get all events with optional month/year filtering
export function getAllEvents(month?: number, year?: number): Event[] {
  if (month !== undefined && year !== undefined) {
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-31`;

    const stmt = db.prepare(`
      SELECT * FROM events
      WHERE date >= ? AND date <= ?
      ORDER BY date ASC, startTime ASC
    `);
    return stmt.all(startDate, endDate) as Event[];
  }

  const stmt = db.prepare('SELECT * FROM events ORDER BY date ASC, startTime ASC');
  return stmt.all() as Event[];
}

// Get a single event by ID
export function getEventById(id: number): Event | undefined {
  const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
  return stmt.get(id) as Event | undefined;
}

// Create a new event
export function createEvent(input: CreateEventInput): Event {
  const stmt = db.prepare(`
    INSERT INTO events (title, description, date, startTime, endTime, color, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const result = stmt.run(
    input.title,
    input.description || null,
    input.date,
    input.startTime || null,
    input.endTime || null,
    input.color || null
  );

  return getEventById(result.lastInsertRowid as number) as Event;
}

// Update an existing event
export function updateEvent(id: number, input: UpdateEventInput): Event | undefined {
  const existing = getEventById(id);
  if (!existing) {
    return undefined;
  }

  const stmt = db.prepare(`
    UPDATE events
    SET title = ?, description = ?, date = ?, startTime = ?, endTime = ?, color = ?, updatedAt = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    input.title ?? existing.title,
    input.description ?? existing.description,
    input.date ?? existing.date,
    input.startTime ?? existing.startTime,
    input.endTime ?? existing.endTime,
    input.color ?? existing.color,
    id
  );

  return getEventById(id);
}

// Delete an event
export function deleteEvent(id: number): boolean {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export default db;
