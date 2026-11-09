import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Icon, Portal, Text } from "react-native-paper";
import { getCategory, getCategoryColors } from "../constants/categories";
import { useAppTheme } from "../theme/theme";
import { Appointment } from "../types/agenda";
import { dayLabel } from "../utils/dateUtils";
import { CategoryChip } from "./CategoryChip";
import { IconTile } from "./ui";

export function ReminderDialog({
  appointment,
  visible,
  onDismiss,
  onView,
}: {
  appointment: Appointment | null;
  visible: boolean;
  onDismiss: () => void;
  onView: (id: string) => void;
}) {
  const theme = useAppTheme();
  const previousAppointment = useRef<Appointment | null>(null);
  useEffect(() => {
    if (appointment) previousAppointment.current = appointment;
  }, [appointment]);

  const shown = appointment ?? previousAppointment.current;
  if (!shown) return null;

  const category = getCategory(shown.category);
  const colors = getCategoryColors(shown.category, theme.dark);
  const heading = shown.allDay
    ? "Lembrete do compromisso"
    : shown.reminderMinutes === 0
      ? "Seu compromisso começa agora"
      : "Seu compromisso está chegando";

  return (
    <Portal>
      <Dialog
        visible={visible && appointment !== null}
        onDismiss={onDismiss}
        style={[
          styles.dialog,
          { borderColor: colors.color, backgroundColor: theme.colors.surface },
        ]}
      >
        <Dialog.Title style={styles.heading}>{heading}</Dialog.Title>
        <Dialog.Content>
          <View style={styles.summary}>
            <View style={styles.information}>
              <Text style={styles.title}>{shown.title}</Text>
              <CategoryChip category={shown.category} />
            </View>
          </View>
          <View style={styles.schedule}>
            <Icon source="clock-outline" size={18} color={colors.color} />
            <Text
              style={[styles.time, { color: theme.colors.onSurfaceVariant }]}
            >
              {`${dayLabel(shown.date)} · ${shown.allDay ? "Dia inteiro" : `${shown.startTime} às ${shown.endTime}`}`}
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={onDismiss} textColor={theme.colors.onSurfaceVariant}>
            Fechar
          </Button>
          <Button
            mode="contained"
            onPress={() => onView(shown.id)}
            buttonColor={colors.color}
            textColor={theme.dark ? theme.colors.background : "#FFFFFF"}
          >
            Ver compromisso
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: "90%",
    maxWidth: 420,
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 22,
  },
  heading: { fontSize: 20, lineHeight: 27, fontWeight: "700" },
  summary: { flexDirection: "row", alignItems: "center", gap: 13 },
  information: { flex: 1, gap: 9, marginLeft: 15 },
  title: { fontSize: 17, fontWeight: "700", lineHeight: 23 },
  schedule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  time: { flex: 1, fontSize: 12, lineHeight: 19 },
  actions: { paddingHorizontal: 17, paddingBottom: 18, flexWrap: "wrap" },
});
