import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Card from '../../components/shared/Card';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen({ navigation }) {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null); // 'patient' | 'healer'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!role) {
      newErrors.role = 'Please select a role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      await signUp(email.trim(), password, role);
      navigation.navigate('Onboarding');
    } catch (err) {
      Alert.alert('Sign Up Failed', err.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join thousands experiencing measured energy healing
          </Text>

          {/* Role selector */}
          <Text style={styles.label}>I am...</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={styles.roleCardWrapper}
              onPress={() => setRole('patient')}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.roleCard,
                  role === 'patient' && styles.roleCardSelected,
                ]}
              >
                <Text style={styles.roleEmoji}>{'   '}</Text>
                <Text
                  style={[
                    styles.roleTitle,
                    role === 'patient' && styles.roleTitleSelected,
                  ]}
                >
                  I need healing
                </Text>
                <Text style={styles.roleDesc}>
                  Track symptoms and connect with verified healers
                </Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCardWrapper}
              onPress={() => setRole('healer')}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.roleCard,
                  role === 'healer' && styles.roleCardSelected,
                ]}
              >
                <Text style={styles.roleEmoji}>{'   '}</Text>
                <Text
                  style={[
                    styles.roleTitle,
                    role === 'healer' && styles.roleTitleSelected,
                  ]}
                >
                  I'm a healer
                </Text>
                <Text style={styles.roleDesc}>
                  Help patients and get verified through testing
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          {/* Inputs */}
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Min 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
            error={errors.password}
          />

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpBtn}
          />

          {/* Social sign-in placeholders */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: T.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleCardWrapper: {
    flex: 1,
  },
  roleCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
  },
  roleCardSelected: {
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  roleEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
    textAlign: 'center',
  },
  roleTitleSelected: {
    color: T.accent,
  },
  roleDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.danger,
    marginBottom: 8,
  },
  signUpBtn: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.border,
  },
  dividerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textDim,
    marginHorizontal: 16,
  },
  socialBtn: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  socialBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  loginLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.accent,
  },
});
