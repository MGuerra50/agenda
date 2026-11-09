import { Animated } from "react-native";
import { BottomNavigation, Icon } from "react-native-paper";
import { useMotionValue } from "../context/MotionContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/theme";
import { TabKey } from "../types/agenda";

const routes = [
  {
    key: "calendar",
    title: "Calendário",
    focusedIcon: "calendar-month",
    unfocusedIcon: "calendar-month-outline",
    accessibilityLabel: "Aba Calendário",
  },
  {
    key: "appointments",
    title: "Compromissos",
    focusedIcon: "checkbox-marked-outline",
    unfocusedIcon: "checkbox-marked-outline",
    accessibilityLabel: "Aba Compromissos",
  },
  {
    key: "settings",
    title: "Configurações",
    focusedIcon: "cog",
    unfocusedIcon: "cog-outline",
    accessibilityLabel: "Aba Configurações",
  },
];

function NavigationIcon({
  source,
  color,
  selected,
}: {
  source: string;
  color: string;
  selected: boolean;
}) {
  const progress = useMotionValue(selected ? 1 : 0);
  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          },
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -1],
            }),
          },
        ],
      }}
    >
      <Icon source={source} size={24} color={color} />
    </Animated.View>
  );
}

export function AppBottomNavigation({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <BottomNavigation.Bar
      navigationState={{
        index: routes.findIndex((route) => route.key === tab),
        routes,
      }}
      onTabPress={({ route }) => onChange(route.key as TabKey)}
      renderIcon={({ route, focused, color }) => (
        <NavigationIcon
          source={focused ? route.focusedIcon : route.unfocusedIcon}
          color={color}
          selected={route.key === tab}
        />
      )}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      activeIndicatorStyle={{
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 18,
      }}
      style={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 27,
        borderTopRightRadius: 27,
        borderTopWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
      safeAreaInsets={{ bottom: Math.max(insets.bottom, 8) }}
      labeled
    />
  );
}
