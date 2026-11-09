import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleProp, ViewStyle } from "react-native";
import { useMotion } from "../context/MotionContext";

type Props = PropsWithChildren<{
  transitionKey: string;
  style?: StyleProp<ViewStyle>;
  distance?: number;
}>;

export function TransitionView({
  transitionKey,
  style,
  distance = 8,
  children,
}: Props) {
  const { duration } = useMotion();
  const progress = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    progress.stopAnimation();
    if (!duration) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [duration, progress, transitionKey]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
