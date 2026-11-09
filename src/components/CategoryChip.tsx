import { Animated } from "react-native";
import { Chip } from "react-native-paper";
import { useMotionValue, usePressFeedback } from "../context/MotionContext";
import { getCategory, getCategoryColors } from "../constants/categories";
import { useAppTheme } from "../theme/theme";
import { CategoryId } from "../types/agenda";

export function CategoryChip({
  category,
  selected,
  onPress,
}: {
  category: CategoryId;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();
  const selection = useMotionValue(selected ? 1 : 0);
  const item = getCategory(category);
  const colors = getCategoryColors(category, theme.dark);
  return (
    <Animated.View style={[{ alignSelf: "flex-start" }, pressStyle]}>
      <Animated.View
        style={{
          transform: [
            {
              scale: selection.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.03],
              }),
            },
          ],
        }}
      >
        <Chip
          icon={item.icon}
          selected={selected}
          showSelectedCheck={false}
          onPress={onPress}
          onPressIn={onPress ? onPressIn : undefined}
          onPressOut={onPress ? onPressOut : undefined}
          accessibilityLabel={`Categoria ${item.label}`}
          accessibilityState={{ selected }}
          compact
          style={{
            alignSelf: "flex-start",
            backgroundColor: colors.tint,
            borderRadius: 12,
            borderWidth: selected ? 1.5 : 0,
            borderColor: colors.color,
          }}
          textStyle={{
            color: colors.color,
            fontSize: 11.5,
            lineHeight: 16,
            marginVertical: 4,
            fontWeight: "600",
          }}
          theme={{
            colors: { onSurfaceVariant: colors.color, primary: colors.color },
          }}
        >
          {item.label}
        </Chip>
      </Animated.View>
    </Animated.View>
  );
}
