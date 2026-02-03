import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventFormData } from '../types';
import { eventsApi } from '../api';

export function useEvents(year: number, month: number) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await eventsApi.getByMonth(year, month + 1);
    if (result.error) {
      setError(result.error);
    } else {
      setEvents(result.data || []);
    }
    setLoading(false);
  }, [year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(async (data: EventFormData) => {
    const result = await eventsApi.create(data);
    if (result.error) {
      throw new Error(result.error);
    }
    await fetchEvents();
    return result.data;
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id: string, data: EventFormData) => {
    const result = await eventsApi.update(id, data);
    if (result.error) {
      throw new Error(result.error);
    }
    await fetchEvents();
    return result.data;
  }, [fetchEvents]);

  const deleteEvent = useCallback(async (id: string) => {
    const result = await eventsApi.delete(id);
    if (result.error) {
      throw new Error(result.error);
    }
    await fetchEvents();
  }, [fetchEvents]);

  const getEventsForDate = useCallback((date: string) => {
    return events.filter(event => event.date === date);
  }, [events]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    refetch: fetchEvents,
  };
}
