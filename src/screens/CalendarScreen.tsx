import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { AddAppointmentButton } from "../components/AddAppointmentButton";
import { AppointmentCard } from "../components/AppointmentCard";
import { ScreenTitle } from "../components/AppHeader";
import { CalendarMonth } from "../components/CalendarMonth";
import { TransitionView } from "../components/TransitionView";
import { EmptyState, IconTile, pageStyles } from "../components/ui";
import { useAgenda } from "../context/AgendaContext";
import { useAppTheme } from "../theme/theme";
import { dayLabel, sortAppointments } from "../utils/dateUtils";

type Props = {
  selectedDate: string;
  month: string;
  onSelectDate: (date: string) => void;
  onChangeMonth: (month: string) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
};

export function CalendarScreen({
  selectedDate,
  month,
  onSelectDate,
  onChangeMonth,
  onOpen,
  onAdd,
}: Props) {
  const theme = useAppTheme();
  const { appointments, today } = useAgenda();
  const events = sortAppointments(
    appointments.filter((item) => item.date === selectedDate),
  );
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[pageStyles.scroll, { paddingBottom: 95 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitle
          title="Calendário"
          subtitle="Organize seus compromissos e eventos"
        />
        <CalendarMonth
          month={month}
          selected={selectedDate}
          onMonthChange={onChangeMonth}
          onSelect={onSelectDate}
        />
        <TransitionView transitionKey={selectedDate}>
          <View style={styles.section}>
            <IconTile icon="calendar-outline" size={40} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text
                style={styles.sectionTitle}
              >{`Eventos de ${dayLabel(selectedDate)}`}</Text>
              <Text
                style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}
              >
                {events.length === 1
                  ? "1 compromisso agendado"
                  : `${events.length} compromissos agendados`}
              </Text>
            </View>
            {selectedDate !== today && (
              <Button
                compact
                onPress={() => onSelectDate(today)}
                labelStyle={{ fontSize: 11, marginHorizontal: 3 }}
              >
                Hoje
              </Button>
            )}
          </View>
          <View style={pageStyles.list}>
            {events.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => onOpen(appointment.id)}
              />
            ))}
            {!events.length && (
              <EmptyState
                title="Seu dia está livre"
                description="Toque no + para reservar um horário para o que importa."
              />
            )}
          </View>
        </TransitionView>
      </ScrollView>
      <AddAppointmentButton
        onPress={onAdd}
        accessibilityLabel="Adicionar compromisso no dia selecionado"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.4 },
});
