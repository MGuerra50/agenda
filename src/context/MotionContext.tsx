import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, Animated, Easing, Platform } from "react-native";

export const transitionDuration = 300;

const MotionContext = createContext(true);

export function MotionProvider({ children }: PropsWithChildren) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    let preferenceChanged = false;
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        preferenceChanged = true;
        setReducedMotion(enabled);
      },
    );

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted && !preferenceChanged) setReducedMotion(enabled);
      })
      .catch(() => {
        if (mounted && !preferenceChanged) setReducedMotion(false);
      });

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return (
    <MotionContext.Provider value={reducedMotion}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const reducedMotion = useContext(MotionContext);
  return { reducedMotion, duration: reducedMotion ? 0 : transitionDuration };
}

export function useMotionValue(target: number, nativeDriver = true) {
  const { duration } = useMotion();
  const value = useRef(new Animated.Value(target)).current;

  useEffect(() => {
    value.stopAnimation();
    if (!duration) {
      value.setValue(target);
      return;
    }
    const animation = Animated.timing(value, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: nativeDriver && Platform.OS !== "web",
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [duration, nativeDriver, target, value]);

  return value;
}

export function usePressFeedback() {
  const { duration } = useMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!duration) {
      progress.stopAnimation();
      progress.setValue(0);
    }
    return () => progress.stopAnimation();
  }, [duration, progress]);

  const animate = useCallback(
    (target: number) => {
      progress.stopAnimation();
      if (!duration) {
        progress.setValue(0);
        return;
      }
      Animated.timing(progress, {
        toValue: target,
        duration: duration / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== "web",
        isInteraction: false,
      }).start();
    },
    [duration, progress],
  );

  return {
    progress,
    onPressIn: useCallback(() => animate(1), [animate]),
    onPressOut: useCallback(() => animate(0), [animate]),
    pressStyle: {
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.96],
          }),
        },
      ],
    },
  };
}
