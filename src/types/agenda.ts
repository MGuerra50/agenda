export type CategoryId = "faculdade" | "trabalho" | "pessoal" | "saude";

export type Appointment = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: CategoryId;
  location: string;
  reminderMinutes: number | null;
  allDay: boolean;
  notes: string;
  participants: string[];
};

export type AppointmentDraft = Omit<Appointment, "id">;
export type PeriodFilter = "today" | "week" | "month" | "all";
export type TabKey = "calendar" | "appointments" | "settings";

export type Preferences = {
  appearance: "light" | "dark" | "system";
  remindersEnabled: boolean;
  defaultReminder: number;
  showWeekNumbers: boolean;
  weekStartsOn: 0 | 1;
  profileName: string;
};
