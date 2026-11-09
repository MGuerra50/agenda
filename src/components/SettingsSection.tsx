import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAppTheme } from "../theme/theme";
import { IconTile } from "./ui";

export function SettingsSection({
  title,
  icon,
  color,
  children,
}: PropsWithChildren<{ title: string; icon: string; color?: string }>) {
  const theme = useAppTheme();
  const accent = color ?? theme.colors.primary;
  return (
    <Card
      mode="elevated"
      elevation={1}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.content}>
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <View style={styles.heading}>
          <IconTile icon={icon} size={33} color={accent} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {children}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 21, marginBottom: 14 },
  content: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
    borderRadius: 21,
  },
  accent: { width: 4, position: "absolute", left: 0, top: 0, bottom: 0 },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginLeft: 3,
    marginBottom: 5,
  },
  title: { fontSize: 18, fontWeight: "700", letterSpacing: -0.4 },
});
