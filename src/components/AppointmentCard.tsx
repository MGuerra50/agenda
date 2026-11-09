import { Animated, StyleSheet, View } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import { getCategory, getCategoryColors } from "../constants/categories";
import { useAgenda } from "../context/AgendaContext";
import { usePressFeedback } from "../context/MotionContext";
import { useAppTheme } from "../theme/theme";
import { Appointment } from "../types/agenda";
import { dayLabel, relativeDay } from "../utils/dateUtils";
import { CategoryChip } from "./CategoryChip";

export function AppointmentCard({
  appointment,
  showDate = false,
  onPress,
}: {
  appointment: Appointment;
  showDate?: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();
  const { today } = useAgenda();
  const colors = getCategoryColors(appointment.category, theme.dark);
  const category = getCategory(appointment.category);
  return (
    <Animated.View style={pressStyle}>
      <Card
        mode="elevated"
        elevation={1}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityLabel={`Ver ${appointment.title}`}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.body}>
          <View style={[styles.stripe, { backgroundColor: colors.color }]} />
          <View
            style={[
              styles.time,
              { width: showDate ? 103 : 82, backgroundColor: colors.tint },
            ]}
          >
            {showDate ? (
              <Icon source={category.icon} size={23} color={colors.color} />
            ) : (
              <Icon source="clock-outline" size={17} color={colors.color} />
            )}
            <Text style={[styles.start, { fontSize: showDate ? 14 : 17 }]}>
              {appointment.allDay ? "Dia inteiro" : appointment.startTime}
            </Text>
            {!appointment.allDay && (
              <Text
                style={[styles.small, { color: theme.colors.onSurfaceVariant }]}
              >{`às ${appointment.endTime}`}</Text>
            )}
            {showDate && (
              <Text
                style={[styles.date, { color: theme.colors.onSurfaceVariant }]}
              >{`${relativeDay(appointment.date, today)}\n${dayLabel(appointment.date)}`}</Text>
            )}
          </View>
          <View style={styles.content}>
            <Text numberOfLines={2} style={styles.title}>
              {appointment.title}
            </Text>
            {appointment.description ? (
              <Text
                numberOfLines={2}
                style={[
                  styles.description,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {appointment.description}
              </Text>
            ) : null}
            <CategoryChip category={appointment.category} />
          </View>
          <Icon
            source="chevron-right"
            size={23}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20 },
  body: {
    paddingVertical: 11,
    paddingLeft: 12,
    paddingRight: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
    borderRadius: 20,
  },
  stripe: {
    position: "absolute",
    left: 0,
    top: 9,
    bottom: 9,
    width: 4,
    borderRadius: 3,
  },
  time: {
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 8,
    minHeight: 88,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 3,
  },
  start: { fontWeight: "700", letterSpacing: -0.3 },
  small: { fontSize: 11.5 },
  date: { fontSize: 10.5, lineHeight: 15, marginTop: 2 },
  content: { flex: 1, gap: 5 },
  title: {
    fontSize: 14.5,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 19,
  },
  description: { fontSize: 11.5, lineHeight: 16 },
});
