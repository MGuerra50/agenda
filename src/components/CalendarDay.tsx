import { Animated, StyleSheet, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { getCategoryColors } from "../constants/categories";
import { useMotionValue, usePressFeedback } from "../context/MotionContext";
import { useAppTheme } from "../theme/theme";
import { CategoryId } from "../types/agenda";
import { dayLabel, parseDate } from "../utils/dateUtils";

export function CalendarDay({
  date,
  selected,
  today,
  outside,
  categories,
  onPress,
}: {
  date: string;
  selected: boolean;
  today: boolean;
  outside: boolean;
  categories: CategoryId[];
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const selection = useMotionValue(selected ? 1 : 0, false);
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();

  return (
    <Animated.View style={[styles.container, pressStyle]}>
      <TouchableRipple
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        borderless
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel(date, true)}${categories.length ? ", com compromissos" : ""}`}
        accessibilityState={{ selected }}
        style={styles.touch}
      >
        <Animated.View
          style={[
            styles.day,
            {
              backgroundColor: selection.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.colors.surface, theme.colors.primary],
              }),
              borderColor:
                today && !selected ? theme.colors.primary : "transparent",
            },
          ]}
        >
          <Animated.Text
            style={{
              fontSize: 15,
              lineHeight: 20,
              fontWeight: selected || today ? "700" : "500",
              color: selection.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  outside ? theme.colors.outline : theme.colors.onSurface,
                  theme.colors.onPrimary,
                ],
              }),
            }}
          >
            {parseDate(date).getDate()}
          </Animated.Text>
          <View style={styles.marks}>
            {categories.map((category) => (
              <Animated.View
                key={category}
                style={[
                  styles.dot,
                  {
                    backgroundColor: selection.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        getCategoryColors(category, theme.dark).color,
                        getCategoryColors(category, true).color,
                      ],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </TouchableRipple>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginVertical: 1 },
  touch: { borderRadius: 13 },
  day: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    paddingTop: 4,
  },
  marks: { height: 7, flexDirection: "row", gap: 3, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 3 },
});
