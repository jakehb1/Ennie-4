import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T } from "../../theme/tokens";
import Logo from "./Logo";

export default function Header({ left, center, right }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.inner}>
        <View style={styles.section}>{left || <Logo />}</View>
        <View style={[styles.section, styles.center]}>{center}</View>
        <View style={[styles.section, styles.right]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    zIndex: 20,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    minHeight: 44,
  },
  section: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
  },
  right: {
    justifyContent: "flex-end",
  },
});
