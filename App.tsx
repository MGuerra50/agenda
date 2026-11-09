import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AgendaProvider, useAgenda } from "./src/context/AgendaContext";
import { MotionProvider, useMotion } from "./src/context/MotionContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { darkTheme, lightTheme } from "./src/theme/theme";

function ThemedAgenda() {
  const { preferences } = useAgenda();
  const { reducedMotion } = useMotion();
  const systemScheme = useColorScheme();
  const dark =
    preferences.appearance === "dark" ||
    (preferences.appearance === "system" && systemScheme === "dark");
  const theme = useMemo(
    () => ({
      ...(dark ? darkTheme : lightTheme),
      animation: { scale: reducedMotion ? 0 : 1 },
    }),
    [dark, reducedMotion],
  );
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={dark ? "light" : "dark"} />
      <AppNavigator />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AgendaProvider>
        <MotionProvider>
          <ThemedAgenda />
        </MotionProvider>
      </AgendaProvider>
    </SafeAreaProvider>
  );
}
