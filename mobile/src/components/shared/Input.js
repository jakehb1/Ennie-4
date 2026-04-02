import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { T, fonts } from "../../theme/tokens";

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error,
  style,
  inputStyle,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={T.textDim}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          multiline && { minHeight: numberOfLines * 20 + 24, textAlignVertical: "top" },
          !editable && styles.inputDisabled,
          inputStyle,
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: T.textDim,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    fontFamily: fonts.bodySemiBold,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.bg,
    color: T.text,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  inputFocused: {
    borderColor: T.accent,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: T.danger,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: T.cardHover,
  },
  errorText: {
    fontSize: 12,
    color: T.danger,
    marginTop: 4,
    fontFamily: fonts.body,
  },
});
