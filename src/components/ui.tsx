import { PropsWithChildren, ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Card, Icon, Text, TouchableRipple } from "react-native-paper";
import { layout, useAppTheme } from "../theme/theme";
import { usePressFeedback } from "../context/MotionContext";

export function IconTile({
  icon,
  color,
  tint,
  size = 42,
}: {
  icon: string;
  color?: string;
  tint?: string;
  size?: number;
}) {
  const theme = useAppTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: tint ?? theme.colors.primaryContainer,
      }}
    >
      <Icon
        source={icon}
        size={size * 0.54}
        color={color ?? theme.colors.primary}
      />
    </View>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const theme = useAppTheme();
  return (
    <View style={styles.empty}>
      <IconTile icon="calendar-check-outline" size={54} />
      <Text style={{ fontSize: 16, fontWeight: "700", marginTop: 13 }}>
        {title}
      </Text>
      <Text
        style={{
          color: theme.colors.onSurfaceVariant,
          textAlign: "center",
          fontSize: 13,
          lineHeight: 20,
          maxWidth: 260,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

export function FieldCard({
  label,
  value,
  icon,
  onPress,
  disabled = false,
  color,
  compact = false,
}: {
  label: string;
  value: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  compact?: boolean;
}) {
  const theme = useAppTheme();
  const { pressStyle, onPressIn, onPressOut } = usePressFeedback();
  return (
    <Animated.View style={pressStyle}>
      <Card
        mode="contained"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 19,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <TouchableRipple
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value}`}
          style={{ borderRadius: 19 }}
          borderless
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: compact ? 7 : 12,
              padding: compact ? 10 : 13,
            }}
          >
            <IconTile icon={icon} size={compact ? 30 : 39} color={color} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: theme.colors.onSurfaceVariant,
                  fontSize: 11.5,
                  marginBottom: 3,
                }}
              >
                {label}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "700" }}>{value}</Text>
            </View>
            {!compact && (
              <Icon
                source="chevron-right"
                size={21}
                color={theme.colors.onSurfaceVariant}
              />
            )}
          </View>
        </TouchableRipple>
      </Card>
    </Animated.View>
  );
}

export function InfoRow({
  icon,
  label,
  children,
  right,
  color,
  tint,
}: PropsWithChildren<{
  icon: string;
  label: string;
  right?: ReactNode;
  color?: string;
  tint?: string;
}>) {
  const theme = useAppTheme();
  return (
    <Card
      mode="contained"
      style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.infoContent}>
        <IconTile icon={icon} color={color} tint={tint} />
        <View
          style={[
            styles.infoText,
            { borderLeftColor: theme.colors.outlineVariant },
          ]}
        >
          <Text
            style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 12,
              marginBottom: 3,
            }}
          >
            {label}
          </Text>
          {typeof children === "string" ? (
            <Text style={{ fontSize: 15, lineHeight: 22, fontWeight: "600" }}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
        {right}
      </View>
    </Card>
  );
}

export const pageStyles = StyleSheet.create({
  scroll: { paddingHorizontal: layout.page, paddingBottom: 24 },
  list: { gap: 11 },
  floating: { position: "absolute", right: 21, bottom: 18, borderRadius: 28 },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  back: { margin: 0, borderRadius: 14 },
});

const styles = StyleSheet.create({
  empty: { alignItems: "center", paddingVertical: 32, gap: 7 },
  infoCard: { borderRadius: layout.radius, marginBottom: 10 },
  infoContent: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  infoText: { flex: 1, borderLeftWidth: 1, paddingLeft: 13 },
});
