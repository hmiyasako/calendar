import { useState, useMemo } from 'react';
import type { CalendarEvent, EventFormData } from '../types';
import { useEvents } from '../hooks/useEvents';
import { EventModal } from './EventModal';
import { DayEventsModal } from './DayEventsModal';
import './Calendar.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarDay {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { loading, error, createEvent, updateEvent, deleteEvent, getEventsForDate } =
    useEvents(currentDate.year, currentDate.month);

  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentDate.year, currentDate.month, 1);
    const lastDay = new Date(currentDate.year, currentDate.month + 1, 0);
    const startPadding = firstDay.getDay();
    const todayString = today.toISOString().split('T')[0];

    // Previous month days
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(currentDate.year, currentDate.month, -i);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isToday: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentDate.year, currentDate.month, i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date,
        dateString,
        isCurrentMonth: true,
        isToday: dateString === todayString,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    // Next month days
    const remaining = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(currentDate.year, currentDate.month + 1, i);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        isToday: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    return days;
  }, [currentDate.year, currentDate.month]);

  const goToPrevMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const goToToday = () => {
    setCurrentDate({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
  };

  const handleDayClick = (dateString: string) => {
    setSelectedEvent(null);
    setSelectedDate(dateString);
    setModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setModalOpen(true);
  };

  const handleSave = async (data: EventFormData) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate('');
  };

  const handleMoreClick = (dateString: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(dateString);
    setDayModalOpen(true);
  };

  const handleDayEventClick = (event: CalendarEvent) => {
    setDayModalOpen(false);
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setModalOpen(true);
  };

  const handleAddNewFromDayModal = () => {
    setDayModalOpen(false);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="btn btn-secondary" onClick={goToPrevMonth}>
            &lt;
          </button>
          <h2 className="calendar-title">
            {MONTHS[currentDate.month]} {currentDate.year}
          </h2>
          <button className="btn btn-secondary" onClick={goToNextMonth}>
            &gt;
          </button>
        </div>
        <button className="btn btn-primary" onClick={goToToday}>
          Today
        </button>
      </div>

      {error && <div className="calendar-error">{error}</div>}

      <div className="calendar-grid">
        {DAYS.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dayEvents = getEventsForDate(day.dateString);
          return (
            <div
              key={day.dateString}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
              onClick={() => handleDayClick(day.dateString)}
            >
              <span className="day-number">{day.date.getDate()}</span>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="event-item"
                    style={{ backgroundColor: event.color || '#3b82f6' }}
                    onClick={(e) => handleEventClick(event, e)}
                    title={event.title}
                  >
                    {event.startTime && (
                      <span className="event-time">{event.startTime}</span>
                    )}
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div
                    className="more-events"
                    onClick={(e) => handleMoreClick(day.dateString, e)}
                  >
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div className="calendar-loading">Loading events...</div>}

      <EventModal
        isOpen={modalOpen}
        event={selectedEvent}
        selectedDate={selectedDate}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <DayEventsModal
        isOpen={dayModalOpen}
        date={selectedDate}
        events={getEventsForDate(selectedDate)}
        onClose={() => setDayModalOpen(false)}
        onEventClick={handleDayEventClick}
        onAddNew={handleAddNewFromDayModal}
      />
    </div>
  );
}
