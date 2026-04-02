import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { T, fonts } from "../../theme/tokens";

export default function Badge({ children, color = T.accent, bg }) {
  const backgroundColor = bg || (color + "18");

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    fontFamily: fonts.bodySemiBold,
  },
});
