import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const STATUS_SEQUENCE = [
  { text: 'Matching...', duration: 1500 },
  { text: 'Found a healer', duration: 1500 },
  { text: 'Connecting...', duration: 1500 },
];

export default function ConnectingScreen({ navigation }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  const textFade = useRef(new Animated.Value(1)).current;

  // Pulsing orb animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim, opacityAnim]);

  // Status text cycling
  useEffect(() => {
    let elapsed = 0;
    const timers = STATUS_SEQUENCE.map((status, i) => {
      const timer = setTimeout(() => {
        Animated.timing(textFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setStatusIndex(i);
          Animated.timing(textFade, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      }, elapsed);
      elapsed += status.duration;
      return timer;
    });

    // Navigate after all statuses shown
    const navTimer = setTimeout(() => {
      navigation.replace('LiveSession');
    }, elapsed + 500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, [navigation, textFade]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Outer glow ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />

        {/* Middle ring */}
        <Animated.View
          style={[
            styles.middleRing,
            {
              transform: [
                {
                  scale: Animated.multiply(scaleAnim, 0.85),
                },
              ],
              opacity: Animated.add(opacityAnim, 0.15),
            },
          ]}
        />

        {/* Inner orb */}
        <View style={styles.orb}>
          <Text style={styles.orbText}>E</Text>
        </View>

        {/* Status text */}
        <Animated.Text style={[styles.statusText, { opacity: textFade }]}>
          {STATUS_SEQUENCE[statusIndex]?.text || 'Connecting...'}
        </Animated.Text>

        <Text style={styles.subText}>
          Finding your healer...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: T.accentDim,
  },
  middleRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139,63,255,0.12)',
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  orbText: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    color: '#FFFFFF',
  },
  statusText: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: T.text,
    marginTop: 48,
  },
  subText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    marginTop: 8,
  },
});
