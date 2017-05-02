const DayPeriod = 24 * 60 * 60 * 1000;
const WeekPeriod = DayPeriod * 7;

function resetTime(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
}

export function getDayPeriod(timestamp = Date.now()) {
  const date = new Date(timestamp);
  resetTime(date);
  const startTime = date.getTime();
  return {
    startTime,
    endTime: startTime + (DayPeriod - 1)
  };
}

export function getWeekPeriod(timestamp = Date.now()) {
  const date = new Date(timestamp);
  resetTime(date);
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() - 1);
  }
  const startTime = date.getTime();
  return {
    startTime,
    endTime: startTime + (WeekPeriod - 1)
  };
}

export function getMonthPeriod(timestamp = Date.now()) {
  const date = new Date(timestamp);
  resetTime(date);
  date.setDate(1);
  const startTime = date.getTime();
  date.setMonth(date.getMonth() + 1);
  const endTime = date.getTime() - 1;
  return { startTime, endTime };
}

export function getYearPeriod(timestamp = Date.now()) {
  const date = new Date(timestamp);
  resetTime(date);
  date.setMonth(0);
  date.setDate(1);
  const startTime = date.getTime();
  date.setFullYear(date.getFullYear() + 1);
  const endTime = date.getTime() - 1;
  return { startTime, endTime };
}
