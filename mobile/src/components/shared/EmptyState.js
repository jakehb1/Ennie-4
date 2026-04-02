import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { T, fonts } from "../../theme/tokens";
import Button from "./Button";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button variant="accent" onPress={onAction} small>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 40,
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: T.text,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: fonts.heading,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: T.textMuted,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  actionWrap: {
    marginTop: 20,
  },
});
