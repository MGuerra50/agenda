import { useCallback, useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { Button, Dialog, Portal, Snackbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBottomNavigation } from "../components/AppBottomNavigation";
import { AppHeader } from "../components/AppHeader";
import { ProfileDialog } from "../components/ProfileDialog";
import { ReminderDialog } from "../components/ReminderDialog";
import { ScreenBackground } from "../components/ScreenBackground";
import { TransitionView } from "../components/TransitionView";
import { useAgenda } from "../context/AgendaContext";
import { useAppointmentReminders } from "../hooks/useAppointmentReminders";
import { AppointmentDetailsScreen } from "../screens/AppointmentDetailsScreen";
import { AppointmentFormScreen } from "../screens/AppointmentFormScreen";
import { AppointmentsScreen } from "../screens/AppointmentsScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AppointmentDraft, PeriodFilter, TabKey } from "../types/agenda";
import { monthKey } from "../utils/dateUtils";
import { useAppTheme } from "../theme/theme";

type Route =
  | { kind: "details"; id: string }
  | { kind: "form"; id?: string; date: string };

export function AppNavigator() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { appointments, today, saveAppointment, deleteAppointment } =
    useAgenda();
  const { reminder, dismissReminder, foreground } =
    useAppointmentReminders(appointments);
  const [tab, setTab] = useState<TabKey>("calendar");
  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(monthKey(today));
  const [filter, setFilter] = useState<PeriodFilter>("today");
  const [stack, setStack] = useState<Route[]>([]);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<{ run: () => void } | null>(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [message, setMessage] = useState("");
  const route = stack.at(-1);
  const screenKey = route ? `${route.kind}-${route.id ?? "new"}` : tab;
  const appointment =
    route && "id" in route
      ? appointments.find((item) => item.id === route.id)
      : undefined;

  const navigate = useCallback(
    (run: () => void) => {
      if (dirty) setPending({ run });
      else run();
    },
    [dirty],
  );
  const goBack = useCallback(
    () => navigate(() => setStack((current) => current.slice(0, -1))),
    [navigate],
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!stack.length) return false;
        goBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [goBack, stack.length]);

  function selectDate(date: string) {
    setSelectedDate(date);
    setMonth(monthKey(date));
  }
  function openAppointment(id: string) {
    setStack((current) => [...current, { kind: "details", id }]);
  }
  function openForm(date: string, id?: string) {
    setStack((current) => [...current, { kind: "form", date, id }]);
  }

  function handleSave(draft: AppointmentDraft, id?: string) {
    const saved = saveAppointment(draft, id);
    setDirty(false);
    selectDate(saved.date);
    setStack((current) =>
      id && current.length > 1
        ? current.slice(0, -1)
        : [...current.slice(0, -1), { kind: "details", id: saved.id }],
    );
    setMessage(
      id ? "Compromisso atualizado." : "Compromisso adicionado à sua agenda.",
    );
  }

  function handleDelete(id: string) {
    deleteAppointment(id);
    setStack([]);
    setMessage("Compromisso excluído.");
  }

  function viewReminder(id: string) {
    dismissReminder();
    const target = appointments.find((item) => item.id === id);
    if (!target) return;
    navigate(() => {
      setDirty(false);
      selectDate(target.date);
      setTab("appointments");
      setStack([{ kind: "details", id }]);
    });
  }

  return (
    <ScreenBackground>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <AppHeader onProfile={() => setProfileVisible(true)} />
        <TransitionView
          transitionKey={`${screenKey}-${theme.dark}`}
          style={{ flex: 1 }}
        >
          {!route && tab === "calendar" && (
            <CalendarScreen
              selectedDate={selectedDate}
              month={month}
              onSelectDate={selectDate}
              onChangeMonth={setMonth}
              onOpen={openAppointment}
              onAdd={() => openForm(selectedDate)}
            />
          )}
          {!route && tab === "appointments" && (
            <AppointmentsScreen
              filter={filter}
              onFilter={setFilter}
              onOpen={openAppointment}
              onAdd={() => openForm(today)}
            />
          )}
          {!route && tab === "settings" && (
            <SettingsScreen onProfile={() => setProfileVisible(true)} />
          )}
          {route?.kind === "form" && (
            <AppointmentFormScreen
              key={route.id ?? "new"}
              appointment={appointment}
              initialDate={route.date}
              onBack={goBack}
              onSave={handleSave}
              onDirtyChange={setDirty}
            />
          )}
          {route?.kind === "details" && appointment && (
            <AppointmentDetailsScreen
              appointment={appointment}
              onBack={goBack}
              onEdit={() => openForm(appointment.date, appointment.id)}
              onDelete={() => handleDelete(appointment.id)}
              onMessage={setMessage}
            />
          )}
        </TransitionView>
        <AppBottomNavigation
          tab={tab}
          onChange={(next) =>
            navigate(() => {
              setDirty(false);
              setStack([]);
              setTab(next);
            })
          }
        />
      </View>
      <ProfileDialog
        visible={profileVisible}
        onDismiss={() => setProfileVisible(false)}
      />
      <Portal>
        <Dialog
          visible={pending !== null}
          onDismiss={() => setPending(null)}
          style={{ width: "90%", maxWidth: 420, alignSelf: "center" }}
        >
          <Dialog.Title>Descartar alterações?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ lineHeight: 22 }}>
              Você tem alterações que ainda não foram salvas.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPending(null)}>Continuar editando</Button>
            <Button
              onPress={() => {
                const action = pending;
                setPending(null);
                setDirty(false);
                action?.run();
              }}
            >
              Descartar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar
        visible={!!message}
        onDismiss={() => setMessage("")}
        duration={3200}
        action={{ label: "OK", onPress: () => setMessage("") }}
        wrapperStyle={{ bottom: 88 + insets.bottom }}
      >
        {message}
      </Snackbar>
      <ReminderDialog
        appointment={reminder}
        visible={foreground && !profileVisible && pending === null}
        onDismiss={dismissReminder}
        onView={viewReminder}
      />
    </ScreenBackground>
  );
}
