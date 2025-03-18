export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };
  
  export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA');
  };
  
  export const getMonthDays = (year: number, month: number): Date[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - startDay.getDay() + (startDay.getDay() === 0 ? -6 : 1));
    
    const days: Date[] = [];
    const currentDay = new Date(startDay);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };
  
  export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };