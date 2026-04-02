import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, PanResponder, Animated } from "react-native";
import { T, fonts } from "../../theme/tokens";

function getColor(value) {
  if (value > 6) return T.danger;
  if (value > 3) return T.warm;
  return T.accent;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export default function Slider({ value = 0, onChange, min = 0, max = 10 }) {
  const trackRef = useRef(null);
  const trackWidth = useRef(0);
  const trackX = useRef(0);

  const handleLayout = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.measure((_x, _y, width, _height, pageX) => {
        trackWidth.current = width;
        trackX.current = pageX;
      });
    }
  }, []);

  const computeValue = useCallback(
    (pageX) => {
      const w = trackWidth.current;
      if (!w) return value;
      const ratio = clamp((pageX - trackX.current) / w, 0, 1);
      return Math.round(ratio * (max - min) + min);
    },
    [min, max, value]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const newVal = computeValue(evt.nativeEvent.pageX);
        onChange?.(newVal);
      },
      onPanResponderMove: (evt) => {
        const newVal = computeValue(evt.nativeEvent.pageX);
        onChange?.(newVal);
      },
    })
  ).current;

  const pct = ((value - min) / (max - min)) * 100;
  const color = getColor(value);

  return (
    <View style={styles.container}>
      {/* Top labels */}
      <View style={styles.topRow}>
        <Text style={styles.labelText}>None</Text>
        <Text style={[styles.valueText, { color }]}>
          {value}/{max}
        </Text>
        <Text style={styles.labelText}>Severe</Text>
      </View>

      {/* Track */}
      <View
        ref={trackRef}
        onLayout={handleLayout}
        style={styles.track}
        {...panResponder.panHandlers}
      >
        {/* Fill */}
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: color,
            },
          ]}
        />

        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: `${pct}%`,
              marginLeft: -16,
              shadowColor: color,
            },
          ]}
        >
          <View style={[styles.thumbDot, { backgroundColor: color }]} />
        </View>
      </View>

      {/* Bottom labels */}
      <View style={styles.bottomRow}>
        <Text style={[styles.bottomLabel, { textAlign: "left" }]}>Mild</Text>
        <Text style={[styles.bottomLabel, { textAlign: "center" }]}>
          Moderate
        </Text>
        <Text style={[styles.bottomLabel, { textAlign: "right" }]}>
          Severe
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  labelText: {
    fontSize: 12,
    color: T.textMuted,
    fontFamily: fonts.body,
  },
  valueText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fonts.bodyBold,
  },
  track: {
    position: "relative",
    height: 32,
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "visible",
    justifyContent: "center",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  thumb: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  bottomLabel: {
    fontSize: 12,
    color: T.textDim,
    flex: 1,
    fontFamily: fonts.body,
  },
});
