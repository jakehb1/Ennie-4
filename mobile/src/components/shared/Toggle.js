import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { T, fonts } from "../../theme/tokens";

export default function Toggle({ on, onToggle, label }) {
  const translateX = useRef(new Animated.Value(on ? 20 : 0)).current;
  const bgColor = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: on ? 20 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }),
      Animated.timing(bgColor, {
        toValue: on ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [on]);

  const trackBg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D8D0EC", T.accent],
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={styles.container}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: T.text,
    fontFamily: fonts.body,
    flex: 1,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
