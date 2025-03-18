export enum EventImportance {
    NORMAL = 'Звичайна',
    IMPORTANT = 'Важлива',
    CRITICAL = 'Критична'
  }
  
  export interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    importance: EventImportance;
  }
  
  export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    importance: EventImportance;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }