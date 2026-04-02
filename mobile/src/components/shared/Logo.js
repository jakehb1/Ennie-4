import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { T, fonts } from "../../theme/tokens";

export default function Logo({ size = 20, full = false }) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="11"
          stroke={T.accent}
          strokeWidth="1.5"
          opacity={0.3}
        />
        <Path
          d="M12 3C7 3 3 7 3 12s4 9 9 9"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View>
        <Text
          style={[
            styles.title,
            { fontSize: size, fontFamily: fonts.headingBold },
          ]}
        >
          Ennie
        </Text>
        {full && (
          <Text style={[styles.subtitle, { fontSize: size * 0.45 }]}>
            by Charlie Goldsmith
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontWeight: "800",
    letterSpacing: -0.5,
    color: T.text,
  },
  subtitle: {
    color: T.textMuted,
    fontWeight: "400",
    marginTop: -2,
  },
});
