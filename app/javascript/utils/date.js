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

export { setToBeginOfDay, setToLastMonday, setToBeginOfMonth, advanceInTime };
