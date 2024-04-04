import { setHours, setMinutes } from "date-fns";

export function convertTimeStringToDate(timeString: string, dueDate: Date): Date {
  const [hours, minutes] = timeString.split(":").map(Number);

  let date = setHours(dueDate, hours);
  date = setMinutes(dueDate, minutes);

  return date;
}