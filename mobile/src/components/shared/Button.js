import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { T, fonts } from "../../theme/tokens";

const VARIANT_STYLES = {
  primary: {
    // Handled via LinearGradient wrapper
    textColor: "#FFFFFF",
  },
  secondary: {
    bg: T.card,
    textColor: T.text,
    borderColor: T.border,
  },
  ghost: {
    bg: "transparent",
    textColor: T.textMuted,
    borderColor: T.border,
  },
  danger: {
    bg: T.dangerDim,
    textColor: T.danger,
    borderColor: T.danger + "30",
  },
  accent: {
    bg: T.accentDim,
    textColor: T.accent,
    borderColor: T.accent + "30",
  },
  warm: {
    bg: T.warmDim,
    textColor: T.warm,
    borderColor: T.warm + "30",
  },
  green: {
    bg: T.greenDim,
    textColor: T.green,
    borderColor: T.green + "30",
  },
};

export default function Button({
  children,
  onPress,
  variant = "primary",
  full = false,
  disabled = false,
  small = false,
  loading = false,
  style,
}) {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const isPrimary = variant === "primary";

  const paddingVertical = small ? 9 : 14;
  const paddingHorizontal = small ? 18 : 22;
  const fontSize = small ? 13 : 15;

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={v.textColor}
          style={styles.loader}
        />
      ) : typeof children === "string" ? (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: v.textColor,
              fontFamily: fonts.bodySemiBold,
            },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={disabled || loading ? undefined : onPress}
        activeOpacity={0.8}
        disabled={disabled || loading}
        style={[full && styles.full, style]}
      >
        <LinearGradient
          colors={["#0A0A0A", "#2A2A2A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            {
              paddingVertical,
              paddingHorizontal,
              opacity: disabled ? 0.4 : 1,
            },
            full && styles.full,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          paddingVertical,
          paddingHorizontal,
          backgroundColor: v.bg,
          borderColor: v.borderColor,
          borderWidth: 1,
          opacity: disabled ? 0.4 : 1,
        },
        full && styles.full,
        style,
      ]}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  full: {
    width: "100%",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  loader: {
    marginVertical: 2,
  },
});
