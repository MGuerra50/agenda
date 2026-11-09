import { Animated, StyleSheet, View } from "react-native";
import { Chip, Icon } from "react-native-paper";
import { useMotionValue, usePressFeedback } from "../context/MotionContext";
import { useAppTheme } from "../theme/theme";

export function AnimatedFilterChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const selection = useMotionValue(selected ? 1 : 0, false);
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();
  const inverse = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View style={[styles.container, pressStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 20,
            backgroundColor: selection.interpolate({
              inputRange: [0, 1],
              outputRange: [theme.colors.surface, theme.colors.primary],
            }),
          },
        ]}
      />
      <Chip
        icon={({ size }) => (
          <View style={{ width: size, height: size }}>
            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: inverse }]}
            >
              <Icon
                source={icon}
                size={size}
                color={theme.colors.onSurfaceVariant}
              />
            </Animated.View>
            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: selection }]}
            >
              <Icon source={icon} size={size} color={theme.colors.onPrimary} />
            </Animated.View>
          </View>
        )}
        compact
        selected={selected}
        showSelectedCheck={false}
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.chip}
        textStyle={styles.label}
      >
        <Animated.Text
          style={{
            color: selection.interpolate({
              inputRange: [0, 1],
              outputRange: [
                theme.colors.onSurfaceVariant,
                theme.colors.onPrimary,
              ],
            }),
          }}
        >
          {label}
        </Animated.Text>
      </Chip>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, borderRadius: 20 },
  chip: { borderRadius: 20, backgroundColor: "transparent" },
  label: { fontSize: 11, marginHorizontal: 6 },
});
