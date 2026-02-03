import type { CalendarEvent } from '../types';
import './DayEventsModal.css';

interface DayEventsModalProps {
  isOpen: boolean;
  date: string;
  events: CalendarEvent[];
  onClose: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddNew: () => void;
}

export function DayEventsModal({
  isOpen,
  date,
  events,
  onClose,
  onEventClick,
  onAddNew,
}: DayEventsModalProps) {
  if (!isOpen) return null;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content day-events-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formattedDate}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="day-events-list">
          {events.length === 0 ? (
            <p className="no-events">No events for this day</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="day-event-item"
                onClick={() => onEventClick(event)}
              >
                <div
                  className="event-color-bar"
                  style={{ backgroundColor: event.color || '#3b82f6' }}
                />
                <div className="event-details">
                  <div className="event-title-row">
                    <span className="event-title">{event.title}</span>
                    {event.startTime && (
                      <span className="event-time">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onAddNew}>
            + Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
