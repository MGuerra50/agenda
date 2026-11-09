import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Text,
} from "react-native-paper";
import { CalendarDay } from "./CalendarDay";
import { TransitionView } from "./TransitionView";
import { useAgenda } from "../context/AgendaContext";
import { useAppTheme } from "../theme/theme";
import {
  calendarWeeks,
  isoWeek,
  monthLabel,
  monthNames,
  parseDate,
  shiftMonth,
} from "../utils/dateUtils";

type Props = {
  month: string;
  selected: string;
  onMonthChange: (month: string) => void;
  onSelect: (date: string) => void;
};

export function CalendarMonth({
  month,
  selected,
  onMonthChange,
  onSelect,
}: Props) {
  const theme = useAppTheme();
  const { appointments, preferences, today } = useAgenda();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [year, setYear] = useState(parseDate(month).getFullYear());
  const weekdayLabels =
    preferences.weekStartsOn === 0
      ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      : ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const weeks = calendarWeeks(month, preferences.weekStartsOn);

  return (
    <>
      <Card
        mode="elevated"
        elevation={1}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            mode="contained"
            containerColor={theme.colors.primaryContainer}
            iconColor={theme.colors.primary}
            size={23}
            onPress={() => onMonthChange(shiftMonth(month, -1))}
            accessibilityLabel="Mês anterior"
            style={styles.arrow}
          />
          <Button
            compact
            icon="chevron-down"
            contentStyle={{ flexDirection: "row-reverse", gap: 5 }}
            labelStyle={[styles.monthTitle, { color: theme.colors.onSurface }]}
            onPress={() => {
              setYear(parseDate(month).getFullYear());
              setPickerVisible(true);
            }}
            accessibilityLabel="Escolher mês e ano"
          >
            {monthLabel(month)}
          </Button>
          <IconButton
            icon="chevron-right"
            mode="contained"
            containerColor={theme.colors.primaryContainer}
            iconColor={theme.colors.primary}
            size={23}
            onPress={() => onMonthChange(shiftMonth(month, 1))}
            accessibilityLabel="Próximo mês"
            style={styles.arrow}
          />
        </View>
        <Divider />
        <TransitionView
          transitionKey={`${month}-${preferences.weekStartsOn}-${preferences.showWeekNumbers}`}
          style={styles.grid}
          distance={4}
        >
          <View style={styles.row}>
            {preferences.showWeekNumbers && (
              <Text
                style={[
                  styles.weekNumber,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                ISO
              </Text>
            )}
            {weekdayLabels.map((day) => (
              <Text
                key={day}
                style={[
                  styles.weekday,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>
          {weeks.map((week) => (
            <View key={week[0]} style={styles.row}>
              {preferences.showWeekNumbers && (
                <Text
                  accessibilityLabel="Número ISO da semana"
                  style={[
                    styles.weekNumber,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {isoWeek(week[preferences.weekStartsOn === 0 ? 1 : 0])}
                </Text>
              )}
              {week.map((date) => {
                const active = date === selected;
                const outside = date.slice(0, 7) !== month.slice(0, 7);
                const marks = [
                  ...new Set(
                    appointments
                      .filter((item) => item.date === date)
                      .map((item) => item.category),
                  ),
                ].slice(0, 3);
                return (
                  <CalendarDay
                    key={date}
                    date={date}
                    selected={active}
                    today={date === today}
                    outside={outside}
                    categories={marks}
                    onPress={() => onSelect(date)}
                  />
                );
              })}
            </View>
          ))}
          {preferences.showWeekNumbers && (
            <Text
              style={[
                styles.isoCaption,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Semana ISO da segunda-feira de cada linha
            </Text>
          )}
        </TransitionView>
      </Card>
      <Portal>
        <Dialog
          visible={pickerVisible}
          onDismiss={() => setPickerVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Escolher mês</Dialog.Title>
          <Dialog.Content>
            <View style={[styles.header, { padding: 0, marginBottom: 12 }]}>
              <IconButton
                icon="chevron-left"
                onPress={() => setYear((value) => value - 1)}
                disabled={year <= 1900}
                accessibilityLabel="Ano anterior"
              />
              <Text style={{ fontWeight: "700", fontSize: 20 }}>{year}</Text>
              <IconButton
                icon="chevron-right"
                onPress={() => setYear((value) => value + 1)}
                disabled={year >= 2100}
                accessibilityLabel="Próximo ano"
              />
            </View>
            <View style={styles.monthGrid}>
              {monthNames.map((name, index) => (
                <Button
                  key={name}
                  compact
                  mode={
                    index === parseDate(month).getMonth() &&
                    year === parseDate(month).getFullYear()
                      ? "contained"
                      : "text"
                  }
                  style={{ width: "31%" }}
                  labelStyle={{ fontSize: 12 }}
                  onPress={() => {
                    onMonthChange(
                      `${year}-${String(index + 1).padStart(2, "0")}-01`,
                    );
                    setPickerVisible(false);
                  }}
                >
                  {name.slice(0, 3)}
                </Button>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPickerVisible(false)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, marginBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
  },
  arrow: { borderRadius: 11, margin: 0, width: 35, height: 35 },
  monthTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginHorizontal: 0,
  },
  grid: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    paddingVertical: 7,
  },
  weekNumber: { width: 24, fontSize: 9, textAlign: "center" },
  isoCaption: { fontSize: 9, textAlign: "center", marginTop: 8 },
  dialog: { width: "90%", maxWidth: 420, alignSelf: "center" },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    justifyContent: "space-between",
  },
});
