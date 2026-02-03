import { useState, useEffect } from 'react';
import { CalendarEvent, EventFormData } from '../types';
import './EventModal.css';

interface EventModalProps {
  isOpen: boolean;
  event?: CalendarEvent | null;
  selectedDate?: string;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const EVENT_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export function EventModal({
  isOpen,
  event,
  selectedDate,
  onClose,
  onSave,
  onDelete
}: EventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    color: EVENT_COLORS[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        color: event.color || EVENT_COLORS[0],
      });
    } else if (selectedDate) {
      setFormData({
        title: '',
        description: '',
        date: selectedDate,
        startTime: '',
        endTime: '',
        color: EVENT_COLORS[0],
      });
    }
    setError(null);
  }, [event, selectedDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    if (!confirm('Are you sure you want to delete this event?')) return;

    setSaving(true);
    try {
      await onDelete(event.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'New Event'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            {event && onDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
