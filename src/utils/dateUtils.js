export const formatDateString = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getDaysRemaining = (targetDateInput) => {
  if (!targetDateInput) return 0;
  const targetDate = new Date(targetDateInput);
  targetDate.setHours(23, 59, 59, 999);

  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getCountdownLabel = (targetDateInput) => {
  const days = getDaysRemaining(targetDateInput);

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      text: absDays === 1 ? '1 day ago' : `${absDays} days ago`,
      isUrgent: false,
      isOverdue: true,
      days,
    };
  }
  if (days === 0) {
    return {
      text: 'Today!',
      isUrgent: true,
      isOverdue: false,
      days: 0,
    };
  }
  if (days === 1) {
    return {
      text: 'Tomorrow',
      isUrgent: true,
      isOverdue: false,
      days: 1,
    };
  }
  return {
    text: `in ${days} days`,
    isUrgent: days <= 3,
    isOverdue: false,
    days,
  };
};

export const isDateToday = (dateInput) => {
  if (!dateInput) return false;
  const d = new Date(dateInput);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDaysToDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentWeekDays = () => {
  const now = new Date();
  // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDay = now.getDay();
  // Calculate distance to Monday: if Sunday (0), Monday was 6 days ago; otherwise day - 1
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);

    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const isToday =
      dayDate.getFullYear() === now.getFullYear() &&
      dayDate.getMonth() === now.getMonth() &&
      dayDate.getDate() === now.getDate();

    weekDays.push({
      dayIndex: i,
      dayName: dayNames[i],
      dayNumber: dayDate.getDate(),
      dateString,
      isToday,
    });
  }

  return weekDays;
};
