import { Animated, Platform } from "react-native";
import { FAB, Icon } from "react-native-paper";
import { usePressFeedback } from "../context/MotionContext";
import { useAppTheme } from "../theme/theme";
import { pageStyles } from "./ui";

export function AddAppointmentButton({
  onPress,
  accessibilityLabel = "Adicionar compromisso",
}: {
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const theme = useAppTheme();
  const { progress, pressStyle, onPressIn, onPressOut } = usePressFeedback();

  return (
    <Animated.View
      style={[pageStyles.floating, pressStyle]}
      onTouchStart={Platform.OS !== "web" ? onPressIn : undefined}
      onTouchEnd={Platform.OS !== "web" ? onPressOut : undefined}
      onTouchCancel={Platform.OS !== "web" ? onPressOut : undefined}
      onPointerDown={Platform.OS === "web" ? onPressIn : undefined}
      onPointerUp={Platform.OS === "web" ? onPressOut : undefined}
      onPointerCancel={Platform.OS === "web" ? onPressOut : undefined}
    >
      <FAB
        icon={({ size, color }) => (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
            }}
          >
            <Icon source="plus" size={size} color={color} />
          </Animated.View>
        )}
        size="medium"
        color="#FFFFFF"
        onPress={onPress}
        style={{
          borderRadius: 28,
          backgroundColor: theme.dark ? "#6B5CE0" : "#4841E8",
        }}
        accessibilityLabel={accessibilityLabel}
      />
    </Animated.View>
  );
}
