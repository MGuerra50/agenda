import { Appointment, PeriodFilter } from "../types/agenda";

export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const pad = (value: number) => String(value).padStart(2, "0");

export function dateKey(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

export function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = parseDate(value);
  return !Number.isNaN(parsed.getTime()) && dateKey(parsed) === value;
}

export function todayKey() {
  return dateKey(new Date());
}

export function addDays(value: string, amount: number) {
  const result = parseDate(value);
  result.setDate(result.getDate() + amount);
  return dateKey(result);
}

export function monthKey(value: string) {
  return `${value.slice(0, 7)}-01`;
}

export function shiftMonth(value: string, amount: number) {
  const result = parseDate(monthKey(value));
  result.setMonth(result.getMonth() + amount);
  return dateKey(result);
}

export function monthLabel(value: string) {
  const parsed = parseDate(value);
  return `${monthNames[parsed.getMonth()]} de ${parsed.getFullYear()}`;
}

export function dayLabel(value: string, includeYear = false) {
  return parseDate(value).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
  });
}

export function shortDate(value: string) {
  return parseDate(value)
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replaceAll(".", "");
}

export function relativeDay(value: string, today: string) {
  if (value === today) return "Hoje";
  if (value === addDays(today, 1)) return "Amanhã";
  if (value === addDays(today, -1)) return "Ontem";
  const weekday = parseDate(value).toLocaleDateString("pt-BR", {
    weekday: "long",
  });
  return weekday[0].toUpperCase() + weekday.slice(1);
}

export function calendarWeeks(month: string, weekStartsOn: 0 | 1) {
  const first = parseDate(monthKey(month));
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const count =
    Math.ceil(
      (offset +
        new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) /
        7,
    ) * 7;
  const start = addDays(dateKey(first), -offset);
  return Array.from({ length: count / 7 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)),
  );
}

export function isoWeek(value: string) {
  const local = parseDate(value);
  const date = new Date(
    Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
  );
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function sortAppointments(items: Appointment[]) {
  return [...items].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      Number(b.allDay) - Number(a.allDay) ||
      a.startTime.localeCompare(b.startTime) ||
      a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function filterByPeriod(
  items: Appointment[],
  filter: PeriodFilter,
  today: string,
  weekStartsOn: 0 | 1,
) {
  const offset = (parseDate(today).getDay() - weekStartsOn + 7) % 7;
  const weekStart = addDays(today, -offset);
  const weekEnd = addDays(weekStart, 6);
  return sortAppointments(
    items.filter((item) => {
      if (filter === "today") return item.date === today;
      if (filter === "week")
        return item.date >= weekStart && item.date <= weekEnd;
      if (filter === "month")
        return item.date.slice(0, 7) === today.slice(0, 7);
      return true;
    }),
  );
}

export function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "MA"
  );
}
