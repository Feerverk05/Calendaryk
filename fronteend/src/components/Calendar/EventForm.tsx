import React, { useState, useEffect } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { EventFormData, EventImportance, Event } from '../../types/event';

interface EventFormProps {
  onSubmit: (eventData: EventFormData) => void;
  onCancel: () => void;
  initialData?: Event;
  isSubmitting: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '', 
    importance: EventImportance.NORMAL
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        startDate: initialData.startDate.slice(0, 16),
        endDate: initialData.endDate ? initialData.endDate.slice(0, 16) : '',
        importance: initialData.importance
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      startDate?: string;
      endDate?: string;
    } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Назва події обов'язкова";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Дата початку обов'язкова";
    }
    
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "Дата завершення має бути після дати початку";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        name="title"
        label="Назва події"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Опис
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="startDate"
          name="startDate"
          label="Дата початку"
          type="datetime-local"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />
        
        <Input
          id="endDate"
          name="endDate"
          label="Дата завершення"
          type="datetime-local"
          value={formData.endDate || ''}  
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-1">
          Важливість
        </label>
        <select
          id="importance"
          name="importance"
          value={formData.importance}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value={EventImportance.NORMAL}>{EventImportance.NORMAL}</option>
          <option value={EventImportance.IMPORTANT}>{EventImportance.IMPORTANT}</option>
          <option value={EventImportance.CRITICAL}>{EventImportance.CRITICAL}</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? 'Оновити' : 'Створити'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;