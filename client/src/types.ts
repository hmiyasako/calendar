// Event interface for calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  color?: string;
}

// Form data for creating/editing events
export interface EventFormData {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color?: string;
}

// Theme types
export type ThemeName = 'light' | 'dark' | 'ocean' | 'forest';

export interface Theme {
  name: ThemeName;
  label: string;
}

// Calendar navigation
export interface CalendarDate {
  year: number;
  month: number; // 0-11
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
