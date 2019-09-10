// For a given date, get the ISO week number
// ref.: https://stackoverflow.com/a/6117889/8352929
const getWeek = d => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return [d.getUTCFullYear(), weekNo];
};

const setToBeginOfDay = date => {
  date.setHours(0, 0, 0, 0);
  return date;
};

const setToLastMonday = date => {
  const monday = 1;
  const distance = date.getDay() - monday;

  date.setDate(date.getDate() - distance);
  setToBeginOfDay(date);

  return date;
};

const setToBeginOfMonth = date => {
  date.setDate(1);
  setToBeginOfDay(date);

  return date;
};

const advanceInTime = (startDate, unit, value) => {
  const clone = new Date(startDate.getTime());

  switch (unit) {
    case 'day':
      clone.setDate(startDate.getDate() + value);
      break;
    case 'month':
      clone.setMonth(startDate.getMonth() + value);
      break;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }

  return clone.getTime();
};

export {
  getWeek,
  setToBeginOfDay,
  setToLastMonday,
  setToBeginOfMonth,
  advanceInTime,
};
