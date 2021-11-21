import dayjs from 'dayjs';

export const getWeekdays = (date = dayjs()) => {
  const firstDay = dayjs(date).startOf('week');
  const lastDay = dayjs(date).endOf('week');

  return Array.from(Array(lastDay.diff(firstDay, 'day') + 1).keys()).map(i => ({
    date: firstDay.add(i, 'day').format('YYYY-MM-DD'),
    name: firstDay.add(i, 'day').format('ddd (D)'),
  }));
};
