import { MD3DarkTheme, MD3LightTheme, useTheme } from "react-native-paper";

const lightColors = {
  ...MD3LightTheme.colors,
  primary: "#4841E8",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E5E2FF",
  onPrimaryContainer: "#29228A",
  secondary: "#008A79",
  secondaryContainer: "#D9F4EE",
  onSecondaryContainer: "#005B4F",
  background: "#F5F4FD",
  onBackground: "#17162D",
  surface: "#FFFFFF",
  onSurface: "#17162D",
  surfaceVariant: "#EFEDF9",
  onSurfaceVariant: "#676580",
  outline: "#9793AD",
  outlineVariant: "#E8E5F4",
  error: "#BB354C",
  errorContainer: "#FCE9EE",
  surfaceDisabled: "#E8E5F0",
  backdrop: "rgba(19, 17, 48, 0.38)",
  elevation: {
    level0: "transparent",
    level1: "#FFFFFF",
    level2: "#FAF9FF",
    level3: "#F2EFFF",
    level4: "#ECE9FC",
    level5: "#E7E3FA",
  },
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: "#B7AEFF",
  onPrimary: "#231574",
  primaryContainer: "#3D337A",
  onPrimaryContainer: "#E9E3FF",
  secondary: "#72D9C7",
  secondaryContainer: "#144139",
  onSecondaryContainer: "#B9F5E7",
  background: "#14131F",
  onBackground: "#F1EEFF",
  surface: "#211F30",
  onSurface: "#F1EEFF",
  surfaceVariant: "#302D43",
  onSurfaceVariant: "#BCB6D2",
  outline: "#948CA9",
  outlineVariant: "#393448",
  error: "#FFB0BD",
  errorContainer: "#582534",
  surfaceDisabled: "#363142",
  backdrop: "rgba(0, 0, 0, 0.65)",
  elevation: {
    level0: "transparent",
    level1: "#211F30",
    level2: "#29253B",
    level3: "#322B47",
    level4: "#3A3152",
    level5: "#40365A",
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 5,
  colors: lightColors,
};
export const darkTheme = { ...MD3DarkTheme, roundness: 5, colors: darkColors };
export type AppTheme = typeof lightTheme;
export const useAppTheme = () => useTheme<AppTheme>();
export const layout = { page: 20, gap: 12, radius: 22, maxWidth: 600 };
