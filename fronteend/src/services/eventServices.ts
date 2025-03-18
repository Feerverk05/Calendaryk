import api from './api';
import { Event, EventFormData } from '../types/event';

export const getAllEvents = async (
  importance?: string,
  keyword?: string
): Promise<Event[]> => {
  let url = '/events';
  const params = new URLSearchParams();
  
  if (importance) {
    params.append('importance', importance);
  }
  
  if (keyword) {
    params.append('keyword', keyword);
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: EventFormData): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  };

export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data.event;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};