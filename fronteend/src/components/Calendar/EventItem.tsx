import React from 'react';
import { Event, EventImportance } from '../../types/event';
import { formatDateTime } from '../../utils/dateUtils';

interface EventItemProps {
  event: Event;
  onClick?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  onClick,
  onEdit,
  onDelete
}) => {
  const importanceColors = {
    [EventImportance.NORMAL]: 'bg-gray-100 border-gray-300',
    [EventImportance.IMPORTANT]: 'bg-yellow-100 border-yellow-300',
    [EventImportance.CRITICAL]: 'bg-red-100 border-red-300'
  };

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      onDelete(event);
    }
  };

  return (
    <div
      className={`p-3 rounded-md border-l-4 shadow-sm mb-2 cursor-pointer hover:shadow-md transition-shadow ${importanceColors[event.importance]}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{event.title}</h3>
        <div className="flex space-x-1">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-blue-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
      <div className="text-xs text-gray-500 mt-2">
        <span>{formatDateTime(event.startDate)}</span>
        {event.endDate && (
          <>
            <span> - </span>
            <span>{formatDateTime(event.endDate)}</span>
          </>
        )}
      </div>
      <div className="text-xs mt-1">
        <span className={`
          px-2 py-1 rounded-full text-xs
          ${event.importance === EventImportance.NORMAL ? 'bg-gray-200 text-gray-700' : ''}
          ${event.importance === EventImportance.IMPORTANT ? 'bg-yellow-200 text-yellow-700' : ''}
          ${event.importance === EventImportance.CRITICAL ? 'bg-red-200 text-red-700' : ''}
        `}>
          {event.importance}
        </span>
      </div>
    </div>
  );
};

export default EventItem;