import React, { useState, useEffect } from 'react';
import { getMonthDays, isSameDay, formatDate } from '../../utils/dateUtils';
import { Event, EventFormData } from '../../types/event';
import EventItem from './EventItem';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import EventForm from './EventForm';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventServices';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthDays = getMonthDays(year, month);
  
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];
  
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      filterEventsByDate(selectedDate);
    } else {
      setVisibleEvents([]);
    }
  }, [selectedDate, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження подій');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByDate = (date: Date) => {
    const filtered = events.filter(event => {
      const eventStart = new Date(event.startDate);
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()
      );
    });
    setVisibleEvents(filtered);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    
    let initialDate = '';
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(new Date().getHours());
      date.setMinutes(new Date().getMinutes());
      initialDate = date.toISOString().slice(0, 16);
    }
    
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

  const eventDotsByDate = monthDays.map(day => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    }).length;
  });

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-2/3 md:pr-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center p-2 font-medium text-gray-700"
              >
                {day}
              </div>
            ))}
            
            {monthDays.map((day, i) => {
              const isCurrentMonth = day.getMonth() === month;
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasEvents = eventDotsByDate[i] > 0;
              
              return (
                <div
                  key={i}
                  onClick={() => handleDateClick(day)}
                  className={`
                    p-2 h-14 relative border cursor-pointer
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                    ${isToday ? 'font-bold border-blue-500' : ''}
                    ${isSelected ? 'bg-blue-100' : ''}
                    hover:bg-gray-100
                  `}
                >
                  <span className="block text-right">{day.getDate()}</span>
                  {hasEvents && (
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(eventDotsByDate[i], 3) }).map((_, j) => (
                          <div
                            key={j}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 mt-4 md:mt-0">
        <div className="bg-white rounded-lg shadow p-4 h-full">
          {selectedDate ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {formatDate(selectedDate.toISOString())}
                </h3>
                <Button onClick={handleCreateEvent} variant="primary">
                  Нова подія
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner"></div>
                </div>
              ) : error ? (
                <div className="p-3 text-red-500">{error}</div>
              ) : visibleEvents.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Немає подій на цей день
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {visibleEvents.map(event => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Виберіть дату для перегляду подій
            </div>
          )}
        </div>
      </div>
      
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

export default Calendar;