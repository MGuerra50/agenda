import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { Appointment } from "../types/agenda";
import { isValidDate, isValidTime, parseDate } from "../utils/dateUtils";

function getSchedule(appointment: Appointment) {
  const time = appointment.allDay ? "00:00" : appointment.startTime;
  const minutes = appointment.reminderMinutes;
  if (
    minutes === null ||
    !Number.isFinite(minutes) ||
    minutes < 0 ||
    !isValidDate(appointment.date) ||
    !isValidTime(time)
  ) {
    return null;
  }

  const start = parseDate(appointment.date);
  const [hours, minute] = time.split(":").map(Number);
  start.setHours(hours, minute, 0, 0);

  return {
    key: `${appointment.id}-${appointment.date}-${time}-${minutes}`,
    appointment,
    notifyAt: start.getTime() - minutes * 60000,
  };
}

export function useAppointmentReminders(appointments: Appointment[]) {
  const [queue, setQueue] = useState<string[]>([]);
  const [foreground, setForeground] = useState(
    () => AppState.currentState === "active",
  );
  const delivered = useRef(new Set<string>());
  const lastChecked = useRef(Date.now());
  const schedules = useMemo(
    () =>
      appointments
        .map(getSchedule)
        .filter((schedule) => schedule !== null)
        .sort((a, b) => a.notifyAt - b.notifyAt),
    [appointments],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      lastChecked.current = Date.now();
      setForeground(state === "active");
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const validKeys = new Set(schedules.map((schedule) => schedule.key));
    setQueue((current) => {
      const valid = current.filter((key) => validKeys.has(key));
      return valid.length === current.length ? current : valid;
    });

    function checkReminders() {
      const now = Date.now();
      const previous = lastChecked.current;
      lastChecked.current = now;
      if (AppState.currentState !== "active") return;

      const due = schedules.filter(
        (schedule) =>
          schedule.notifyAt > previous &&
          schedule.notifyAt <= now &&
          !delivered.current.has(schedule.key),
      );

      if (!due.length) return;
      due.forEach((schedule) => delivered.current.add(schedule.key));
      setQueue((current) => [
        ...current,
        ...due.map((schedule) => schedule.key),
      ]);
    }

    checkReminders();
    const timer = setInterval(checkReminders, 1000);
    return () => clearInterval(timer);
  }, [schedules]);

  const activeKey = queue.find((key) =>
    schedules.some((schedule) => schedule.key === key),
  );
  const reminder =
    schedules.find((schedule) => schedule.key === activeKey)?.appointment ??
    null;
  const dismissReminder = useCallback(() => {
    setQueue((current) => current.filter((key) => key !== activeKey));
  }, [activeKey]);

  return { reminder, dismissReminder, foreground };
}
