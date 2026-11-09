import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { createInitialAppointments } from "../data/initialAppointments";
import { Appointment, AppointmentDraft, Preferences } from "../types/agenda";
import { todayKey } from "../utils/dateUtils";

type AgendaContextValue = {
  appointments: Appointment[];
  preferences: Preferences;
  today: string;
  saveAppointment: (draft: AppointmentDraft, id?: string) => Appointment;
  deleteAppointment: (id: string) => void;
  updatePreferences: (changes: Partial<Preferences>) => void;
};

const AgendaContext = createContext<AgendaContextValue | null>(null);

export function AgendaProvider({ children }: PropsWithChildren) {
  const [today, setToday] = useState(todayKey);
  const [appointments, setAppointments] = useState(() =>
    createInitialAppointments(todayKey()),
  );
  const [preferences, setPreferences] = useState<Preferences>({
    appearance: "system",
    remindersEnabled: true,
    defaultReminder: 15,
    showWeekNumbers: false,
    weekStartsOn: 0,
    profileName: "Matheus Guerra",
  });

  useEffect(() => {
    const timer = setInterval(() => setToday(todayKey()), 60000);
    return () => clearInterval(timer);
  }, []);

  function saveAppointment(draft: AppointmentDraft, id?: string) {
    const appointment = {
      ...draft,
      id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    setAppointments((current) =>
      id
        ? current.map((item) => (item.id === id ? appointment : item))
        : [...current, appointment],
    );
    return appointment;
  }

  function deleteAppointment(id: string) {
    setAppointments((current) => current.filter((item) => item.id !== id));
  }

  function updatePreferences(changes: Partial<Preferences>) {
    setPreferences((current) => ({ ...current, ...changes }));
  }

  return (
    <AgendaContext.Provider
      value={{
        appointments,
        preferences,
        today,
        saveAppointment,
        deleteAppointment,
        updatePreferences,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (!context) throw new Error("AgendaProvider não foi configurado.");
  return context;
}
