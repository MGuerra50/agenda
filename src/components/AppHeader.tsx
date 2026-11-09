import { ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Icon, Text, TouchableRipple } from "react-native-paper";
import { useAgenda } from "../context/AgendaContext";
import { usePressFeedback } from "../context/MotionContext";
import { layout, useAppTheme } from "../theme/theme";
import { initials } from "../utils/dateUtils";

export function AppHeader({ onProfile }: { onProfile: () => void }) {
  const theme = useAppTheme();
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();
  const { preferences } = useAgenda();
  return (
    <View style={styles.header}>
      <LinearGradient colors={["#6D66FF", "#3530BB"]} style={styles.logo}>
        <Icon source="calendar-blank-outline" color="#FFFFFF" size={29} />
      </LinearGradient>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>Minha Agenda</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 11.5 }}>
          Calendário e compromissos
        </Text>
      </View>
      <Animated.View style={pressStyle}>
        <TouchableRipple
          borderless
          onPress={onProfile}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          accessibilityLabel="Abrir perfil local"
          style={styles.avatarButton}
        >
          <Avatar.Text
            label={initials(preferences.profileName)}
            size={43}
            color="#FFFFFF"
            style={{ backgroundColor: theme.dark ? "#6558B9" : "#8781F4" }}
            labelStyle={{ fontSize: 15, fontWeight: "700" }}
          />
        </TouchableRipple>
      </Animated.View>
    </View>
  );
}

export function ScreenTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const theme = useAppTheme();
  return (
    <View style={styles.heading}>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.page,
    paddingTop: 15,
    paddingBottom: 20,
    gap: 12,
  },
  logo: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 10px rgba(67, 53, 188, 0.18)",
  },
  brand: { flex: 1, gap: 3 },
  brandTitle: { fontSize: 19, fontWeight: "700", letterSpacing: -0.5 },
  avatarButton: { borderRadius: 24 },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  subtitle: { fontSize: 13, lineHeight: 20, marginTop: 1 },
});
