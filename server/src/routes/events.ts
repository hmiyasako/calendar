import { Router, Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  CreateEventInput,
  UpdateEventInput,
} from '../db';

const router = Router();

// GET /api/events - Get all events (with optional month/year query params)
router.get('/', (req: Request, res: Response) => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

    // Validate month and year if provided
    if (month !== undefined && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ error: 'Invalid month. Must be between 1 and 12.' });
    }
    if (year !== undefined && (isNaN(year) || year < 1900 || year > 2100)) {
      return res.status(400).json({ error: 'Invalid year. Must be between 1900 and 2100.' });
    }

    const events = getAllEvents(month, year);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create event
router.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateEventInput = req.body;

    // Validate required fields
    if (!input.title || typeof input.title !== 'string' || input.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    if (!input.date || typeof input.date !== 'string') {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.date)) {
      return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
    }

    // Validate time format if provided (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (input.startTime && !timeRegex.test(input.startTime)) {
      return res.status(400).json({ error: 'Start time must be in HH:MM format (24-hour)' });
    }
    if (input.endTime && !timeRegex.test(input.endTime)) {
      return res.status(400).json({ error: 'End time must be in HH:MM format (24-hour)' });
    }

    // Validate color format if provided (hex color)
    if (input.color) {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(input.color)) {
        return res.status(400).json({ error: 'Color must be a valid hex color (e.g., #FF5733)' });
      }
    }

    const event = createEvent({
      ...input,
      title: input.title.trim(),
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const input: UpdateEventInput = req.body;

    // Validate title if provided
    if (input.title !== undefined) {
      if (typeof input.title !== 'string' || input.title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      input.title = input.title.trim();
    }

    // Validate date format if provided
    if (input.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(input.date)) {
        return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
      }
    }

    // Validate time format if provided
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (input.startTime && !timeRegex.test(input.startTime)) {
      return res.status(400).json({ error: 'Start time must be in HH:MM format (24-hour)' });
    }
    if (input.endTime && !timeRegex.test(input.endTime)) {
      return res.status(400).json({ error: 'End time must be in HH:MM format (24-hour)' });
    }

    // Validate color format if provided
    if (input.color) {
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(input.color)) {
        return res.status(400).json({ error: 'Color must be a valid hex color (e.g., #FF5733)' });
      }
    }

    const event = updateEvent(id, input);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const deleted = deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
