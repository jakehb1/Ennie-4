import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { T, fonts } from "../../theme/tokens";

export default function ChatBubble({ text, isAI }) {
  return (
    <View
      style={[
        styles.row,
        isAI ? styles.rowAI : styles.rowUser,
      ]}
    >
      {/* AI avatar */}
      {isAI && (
        <LinearGradient
          colors={["#0A0A0A", "#2A2A2A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>E</Text>
        </LinearGradient>
      )}

      {/* Bubble */}
      <View
        style={[
          styles.bubble,
          isAI ? styles.bubbleAI : styles.bubbleUser,
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  rowAI: {
    justifyContent: "flex-start",
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: fonts.headingBold,
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleAI: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bubbleUser: {
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accent + "30",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  text: {
    color: T.text,
    fontSize: 13.5,
    lineHeight: 21,
    fontFamily: fonts.body,
  },
});
