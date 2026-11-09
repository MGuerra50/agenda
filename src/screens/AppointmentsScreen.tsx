import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { AddAppointmentButton } from "../components/AddAppointmentButton";
import { AnimatedFilterChip } from "../components/AnimatedFilterChip";
import { ScreenTitle } from "../components/AppHeader";
import { AppointmentCard } from "../components/AppointmentCard";
import { TransitionView } from "../components/TransitionView";
import { EmptyState, pageStyles } from "../components/ui";
import { useAgenda } from "../context/AgendaContext";
import { useAppTheme } from "../theme/theme";
import { PeriodFilter } from "../types/agenda";
import { filterByPeriod } from "../utils/dateUtils";

const filters = [
  { key: "today", title: "Hoje", icon: "white-balance-sunny" },
  { key: "week", title: "Semana", icon: "calendar-week-outline" },
  { key: "month", title: "Mês", icon: "calendar-month-outline" },
  { key: "all", title: "Todos", icon: "layers-outline" },
] as const;

export function AppointmentsScreen({
  filter,
  onFilter,
  onOpen,
  onAdd,
}: {
  filter: PeriodFilter;
  onFilter: (filter: PeriodFilter) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
}) {
  const theme = useAppTheme();
  const { appointments, preferences, today } = useAgenda();
  const events = filterByPeriod(
    appointments,
    filter,
    today,
    preferences.weekStartsOn,
  );
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[pageStyles.scroll, { paddingBottom: 95 }]}
      >
        <ScreenTitle
          title="Compromissos"
          subtitle="Seu tempo, organizado do seu jeito"
        />
        <View style={styles.filters}>
          {filters.map((item) => (
            <AnimatedFilterChip
              key={item.key}
              icon={item.icon}
              label={item.title}
              selected={item.key === filter}
              onPress={() => onFilter(item.key)}
            />
          ))}
        </View>
        <TransitionView transitionKey={filter}>
          <Text
            style={{
              fontSize: 11,
              color: theme.colors.onSurfaceVariant,
              marginBottom: 12,
            }}
          >{`${events.length} ${events.length === 1 ? "compromisso" : "compromissos"} ${filter === "all" ? "na sua agenda" : "neste período"}`}</Text>
          <View style={pageStyles.list}>
            {events.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDate
                onPress={() => onOpen(appointment.id)}
              />
            ))}
            {!events.length && (
              <EmptyState
                title="Tudo tranquilo por aqui"
                description="Não há compromissos neste período. Que tal planejar seu próximo evento?"
              />
            )}
          </View>
        </TransitionView>
      </ScrollView>
      <AddAppointmentButton onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", gap: 6, marginBottom: 19, flexWrap: "wrap" },
});
