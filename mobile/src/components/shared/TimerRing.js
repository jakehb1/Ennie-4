import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { T, fonts } from "../../theme/tokens";

export default function TimerRing({ seconds, total, size = 58 }) {
  const pct = total > 0 ? seconds / total : 0;
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  const color = seconds < 60 ? T.danger : seconds < 150 ? T.warm : T.accent;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={T.border}
          strokeWidth={3.5}
        />
        {/* Progress ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            { color, fontSize: size > 58 ? 16 : 14 },
          ]}
        >
          {m}:{s.toString().padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  labelContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    fontFamily: fonts.bodyBold,
  },
});
