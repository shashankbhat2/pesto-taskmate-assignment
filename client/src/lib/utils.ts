import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { TaskType } from "@/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statusOrder = ["TODO", "DOING", "DONE"];

export function formatDate(dateString: string) {
  const today = isToday(new Date(dateString));
  const yesterday = isYesterday(new Date(dateString));
  const tomorrow = isTomorrow(new Date(dateString));

  if (today) {
    return "today";
  } else if (yesterday) {
    return "yesterday";
  } else if (tomorrow) {
    return "tomorrow";
  } else {
    return format(new Date(dateString), "MM/dd/yyyy");
  }
}


export function sortTasksByStatus(taskA: TaskType, taskB: TaskType) {
  return statusOrder.indexOf(taskA.status) - statusOrder.indexOf(taskB.status);
}

export const getPageRange = (totalPages: number, currentPage: number) => {
  const visiblePageCount = 3;
  const visiblePageCountHalf = Math.floor(visiblePageCount / 2);

  let startPage = Math.max(1, currentPage - visiblePageCountHalf);
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

  if (currentPage < visiblePageCountHalf + 1) {
    endPage = Math.min(visiblePageCount, totalPages);
  } else if (currentPage > totalPages - visiblePageCountHalf) {
    startPage = Math.max(1, totalPages - visiblePageCount + 1);
  }

  const result = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  return result;
};

export const PLACEHOLDER_PAGES = [1];
