import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import { T, fonts } from "../../theme/tokens";

export default function StatCard({ label, value, sub, color = T.accent, icon }) {
  return (
    <Card style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
        </View>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 120,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: T.textMuted,
    marginBottom: 4,
    fontFamily: fonts.bodyMedium,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: fonts.bodyBold,
  },
  sub: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 2,
    fontFamily: fonts.body,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
});
