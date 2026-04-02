import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { T } from "../../theme/tokens";

export default function Card({ children, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const pressProps = onPress
    ? { onPress, activeOpacity: 0.85 }
    : {};

  return (
    <Wrapper style={[styles.card, style]} {...pressProps}>
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
  },
});
