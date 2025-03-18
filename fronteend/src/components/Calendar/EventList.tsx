import React, { useState, useEffect } from 'react';
import EventItem from './EventItem';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import EventForm from './EventForm';
import { Event, EventFormData, EventImportance } from '../../types/event'
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventServices'

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    importance: string;
    keyword: string;
  }>({
    importance: '',
    keyword: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents(filter.importance, filter.keyword);
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження подій');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteEvent(event.id);
      setEvents(events.filter(e => e.id !== event.id));
    } catch (err) {
      setError('Помилка видалення події');
      console.error(err);
    }
  };

  const handleSubmitEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        const updated = await updateEvent(editingEvent.id, formData);
        setEvents(events.map(e => e.id === editingEvent.id ? updated : e));
      } else {
        const created = await createEvent(formData);
        setEvents([...events, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Помилка збереження події');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список подій</h1>
        <Button onClick={handleCreateEvent}>Нова подія</Button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Пошук
            </label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={filter.keyword}
              onChange={handleFilterChange}
              placeholder="Шукати за назвою чи описом..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-1">
              Фільтр за важливістю
            </label>
            <select
              id="importance"
              name="importance"
              value={filter.importance}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">Всі</option>
              <option value={EventImportance.NORMAL}>{EventImportance.NORMAL}</option>
              <option value={EventImportance.IMPORTANT}>{EventImportance.IMPORTANT}</option>
              <option value={EventImportance.CRITICAL}>{EventImportance.CRITICAL}</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-md shadow-sm">
          <p className="text-gray-500">Немає подій для відображення</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <EventItem
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Редагувати подію' : 'Нова подія'}
      >
        <EventForm
          onSubmit={handleSubmitEvent}
          onCancel={() => setIsModalOpen(false)}
          initialData={editingEvent || undefined}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default EventList;