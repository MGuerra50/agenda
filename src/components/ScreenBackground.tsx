import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { layout, useAppTheme } from "../theme/theme";

export function ScreenBackground({ children }: PropsWithChildren) {
  const theme = useAppTheme();
  return (
    <View style={[styles.outer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.frame}>
        <LinearGradient
          pointerEvents="none"
          colors={
            theme.dark
              ? ["#211D39", "#14131F", "#201B35"]
              : ["#F0EEFF", "#FAFAFF", "#F0EDFC"]
          }
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            styles.wave,
            { backgroundColor: theme.dark ? "#18333A" : "#DDF2F8" },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.wave,
            styles.secondWave,
            { backgroundColor: theme.dark ? "#1E3946" : "#C8ECF3" },
          ]}
        />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center" },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: layout.maxWidth,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    width: 360,
    height: 230,
    right: -175,
    top: 55,
    borderRadius: 130,
    transform: [{ rotate: "-37deg" }],
    opacity: 0.75,
  },
  secondWave: { right: -235, top: 105, opacity: 0.8 },
});
