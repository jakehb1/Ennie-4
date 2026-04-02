import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { T } from "../../theme/tokens";

export default function ProgressBar({
  value = 0,
  max = 100,
  color = T.accent,
  height = 6,
  animated = true,
  style,
}) {
  const pct = Math.min(100, (value / max) * 100);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: pct,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(pct);
    }
  }, [pct, animated]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width: animatedWidth,
            backgroundColor: color,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: T.surface,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
