import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

export const getWeekdays = (date = dayjs()) => {
  dayjs.extend(isoWeek);

  const firstDay = dayjs(date).startOf('isoWeek');
  const lastDay = dayjs(date).endOf('isoWeek');

  return Array.from(Array(lastDay.diff(firstDay, 'day') + 1).keys()).map((i) => ({
    date: firstDay.add(i, 'day').format('YYYY-MM-DD'),
    name: firstDay.add(i, 'day').format('ddd (D)'),
  }));
};
