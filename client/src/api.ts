import { CalendarEvent, EventFormData, ApiResponse } from './types';

const API_BASE_URL = '/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `HTTP error ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Event API functions
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<ApiResponse<CalendarEvent[]>> => {
    return fetchApi<CalendarEvent[]>('/events');
  },

  // Get events for a specific month
  getByMonth: async (year: number, month: number): Promise<ApiResponse<CalendarEvent[]>> => {
    return fetchApi<CalendarEvent[]>(`/events?year=${year}&month=${month}`);
  },

  // Get a single event by ID
  getById: async (id: string): Promise<ApiResponse<CalendarEvent>> => {
    return fetchApi<CalendarEvent>(`/events/${id}`);
  },

  // Create a new event
  create: async (event: EventFormData): Promise<ApiResponse<CalendarEvent>> => {
    return fetchApi<CalendarEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  // Update an existing event
  update: async (id: string, event: EventFormData): Promise<ApiResponse<CalendarEvent>> => {
    return fetchApi<CalendarEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  },

  // Delete an event
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchApi<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

export default eventsApi;
