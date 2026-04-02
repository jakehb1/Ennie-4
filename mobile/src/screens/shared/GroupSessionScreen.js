import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const { width } = Dimensions.get('window');
const TOTAL_DURATION = 30 * 60; // 30 minutes in seconds

const PHASES = [
  { label: 'Intro', duration: 5 * 60 },
  { label: 'Healing', duration: 20 * 60 },
  { label: 'Close', duration: 5 * 60 },
];

const GUIDANCE_MESSAGES = [
  'Take a deep breath and relax your body...',
  'Focus on the area where you feel discomfort...',
  'Imagine warm, healing energy flowing to that area...',
  'Let go of any tension you are holding...',
  'Feel the energy moving through your body...',
  'Allow yourself to be fully present in this moment...',
  'The healing energy is working on your pain...',
  'Breathe deeply and stay connected...',
];

const PARTICIPANT_UPDATES = [
  { name: 'Sarah', message: "migraine improved 40%!" },
  { name: 'Mike', message: "back pain down to 3/10" },
  { name: 'Lisa', message: "feeling more relaxed" },
  { name: 'James', message: "shoulder tension releasing" },
  { name: 'Anna', message: "pain decreased by 50%!" },
  { name: 'Tom', message: "anxiety level dropping" },
];

export default function GroupSessionScreen({ navigation, route }) {
  const session = route?.params?.session ?? {
    focus: 'Chronic Pain Relief',
    healer: 'Sarah Chen',
  };
  const intake = route?.params?.intake ?? { severity: 5 };

  const [elapsed, setElapsed] = useState(0);
  const [severity, setSeverity] = useState(intake.severity);
  const [guidanceIdx, setGuidanceIdx] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [participantCount] = useState(22);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tickerAnim = useRef(new Animated.Value(0)).current;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= TOTAL_DURATION) {
          clearInterval(interval);
          return TOTAL_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guidance cycling
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setGuidanceIdx((prev) => (prev + 1) % GUIDANCE_MESSAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  // Participant ticker
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(tickerAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(tickerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTickerIdx((prev) => (prev + 1) % PARTICIPANT_UPDATES.length);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [tickerAnim]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = TOTAL_DURATION - elapsed;
  const progress = elapsed / TOTAL_DURATION;

  // Current phase
  let currentPhase = PHASES[0];
  let phaseElapsed = elapsed;
  for (const phase of PHASES) {
    if (phaseElapsed < phase.duration) {
      currentPhase = phase;
      break;
    }
    phaseElapsed -= phase.duration;
  }

  const handleLeave = () => {
    Alert.alert(
      'Leave Session?',
      'Are you sure you want to leave this healing session?',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: chatInput, sender: 'You' },
    ]);
    setChatInput('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with timer */}
      <View style={styles.header}>
        <View style={styles.timerSection}>
          <View style={styles.timerRing}>
            <View
              style={[
                styles.timerRingProgress,
                {
                  borderColor: T.accent,
                  borderTopColor:
                    progress < 0.25
                      ? 'transparent'
                      : T.accent,
                },
              ]}
            />
            <Text style={styles.timerText}>{formatTime(remaining)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.sessionTitle}>{session.focus}</Text>
            <Text style={styles.participantCount}>
              {participantCount} participants
            </Text>
          </View>
        </View>

        {/* Phase indicator */}
        <View style={styles.phaseRow}>
          {PHASES.map((phase, idx) => {
            const isActive = phase.label === currentPhase.label;
            const phaseBefore =
              PHASES.slice(0, idx).reduce((sum, p) => sum + p.duration, 0);
            const isPast = elapsed >= phaseBefore + phase.duration;
            return (
              <View key={phase.label} style={styles.phaseItem}>
                <View
                  style={[
                    styles.phaseDot,
                    isActive && styles.phaseDotActive,
                    isPast && styles.phaseDotPast,
                  ]}
                />
                <Text
                  style={[
                    styles.phaseLabel,
                    isActive && styles.phaseLabelActive,
                  ]}
                >
                  {phase.label} ({phase.duration / 60}m)
                </Text>
                {idx < PHASES.length - 1 && <View style={styles.phaseLine} />}
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Healer info card */}
        <View style={styles.healerCard}>
          <View style={styles.healerAvatar}>
            <Text style={styles.healerInitial}>
              {session.healer?.charAt(0) ?? 'S'}
            </Text>
          </View>
          <View style={styles.healerInfo}>
            <Text style={styles.healerName}>{session.healer}</Text>
            <Text style={styles.healerStatus}>Leading this session</Text>
          </View>
          <View style={styles.healerLive}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Guidance message */}
        <Animated.View style={[styles.guidanceCard, { opacity: fadeAnim }]}>
          <Text style={styles.guidanceText}>
            {GUIDANCE_MESSAGES[guidanceIdx]}
          </Text>
        </Animated.View>

        {/* Participant ticker */}
        <Animated.View
          style={[
            styles.tickerCard,
            {
              opacity: tickerAnim,
              transform: [
                {
                  translateY: tickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.tickerDot} />
          <Text style={styles.tickerText}>
            {PARTICIPANT_UPDATES[tickerIdx].name}'s{' '}
            {PARTICIPANT_UPDATES[tickerIdx].message}
          </Text>
        </Animated.View>

        {/* Reaction indicators */}
        <View style={styles.reactionRow}>
          <TouchableOpacity style={styles.reactionBtn}>
            <Text style={styles.reactionEmoji}>{'\u2764\uFE0F'}</Text>
            <Text style={styles.reactionCount}>12</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBtn}>
            <Text style={styles.reactionEmoji}>{'\uD83D\uDE4F'}</Text>
            <Text style={styles.reactionCount}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBtn}>
            <Text style={styles.reactionEmoji}>{'\u2728'}</Text>
            <Text style={styles.reactionCount}>15</Text>
          </TouchableOpacity>
        </View>

        {/* Your symptom card */}
        <View style={styles.symptomCard}>
          <Text style={styles.symptomTitle}>Your Symptom Level</Text>
          <View style={styles.symptomSlider}>
            {Array.from({ length: 11 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.symptomDot,
                  severity === i && styles.symptomDotActive,
                  i <= 3 && {
                    backgroundColor:
                      severity === i ? T.green : T.greenDim,
                  },
                  i >= 4 &&
                    i <= 6 && {
                      backgroundColor:
                        severity === i ? T.warm : T.warmDim,
                    },
                  i >= 7 && {
                    backgroundColor:
                      severity === i ? T.danger : T.dangerDim,
                  },
                ]}
                onPress={() => setSeverity(i)}
              >
                <Text
                  style={[
                    styles.symptomNum,
                    severity === i && styles.symptomNumActive,
                  ]}
                >
                  {i}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {severity < intake.severity && (
            <View style={styles.improvementBadge}>
              <Text style={styles.improvementText}>
                {Math.round(
                  ((intake.severity - severity) / intake.severity) * 100
                )}
                % improvement!
              </Text>
            </View>
          )}
        </View>

        {/* Collapsible chat */}
        <TouchableOpacity
          style={styles.chatToggle}
          onPress={() => setChatOpen(!chatOpen)}
        >
          <Text style={styles.chatToggleText}>
            {chatOpen ? 'Hide Chat' : 'Show Chat'}
          </Text>
          <Text style={styles.chatToggleArrow}>
            {chatOpen ? '\u25B2' : '\u25BC'}
          </Text>
        </TouchableOpacity>

        {chatOpen && (
          <View style={styles.chatArea}>
            {chatMessages.length === 0 && (
              <Text style={styles.chatEmpty}>
                Say hello to the group...
              </Text>
            )}
            {chatMessages.map((msg) => (
              <View key={msg.id} style={styles.chatBubble}>
                <Text style={styles.chatSender}>{msg.sender}</Text>
                <Text style={styles.chatMsgText}>{msg.text}</Text>
              </View>
            ))}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type a message..."
                placeholderTextColor={T.textDim}
              />
              <TouchableOpacity
                style={styles.chatSendBtn}
                onPress={sendChat}
              >
                <Text style={styles.chatSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Leave session */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.leaveBtn}
          activeOpacity={0.8}
          onPress={handleLeave}
        >
          <Text style={styles.leaveBtnText}>Leave Session</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  timerRingProgress: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: T.accent,
  },
  timerText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: T.text,
  },
  headerInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
  },
  participantCount: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'center',
  },
  phaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.border,
    marginRight: 6,
  },
  phaseDotActive: {
    backgroundColor: T.accent,
  },
  phaseDotPast: {
    backgroundColor: T.green,
  },
  phaseLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
  },
  phaseLabelActive: {
    fontFamily: fonts.bodySemiBold,
    color: T.accent,
  },
  phaseLine: {
    width: 20,
    height: 1,
    backgroundColor: T.border,
    marginHorizontal: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  healerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.accentDim,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  healerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healerInitial: {
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  healerInfo: {
    flex: 1,
  },
  healerName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
  },
  healerStatus: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
  },
  healerLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.dangerDim,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.danger,
    marginRight: 6,
  },
  liveText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: T.danger,
  },
  guidanceCard: {
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  guidanceText: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: T.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  tickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.greenDim,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  tickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.green,
    marginRight: 10,
  },
  tickerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.green,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  reactionEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  reactionCount: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: T.textMuted,
  },
  symptomCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
  },
  symptomTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 12,
  },
  symptomSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  symptomDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomDotActive: {
    transform: [{ scale: 1.2 }],
  },
  symptomNum: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: T.textMuted,
  },
  symptomNumActive: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
  },
  improvementBadge: {
    backgroundColor: T.greenDim,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginTop: 12,
  },
  improvementText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.green,
  },
  chatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  chatToggleText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
    marginRight: 6,
  },
  chatToggleArrow: {
    fontSize: 10,
    color: T.accent,
  },
  chatArea: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginTop: 8,
  },
  chatEmpty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textDim,
    textAlign: 'center',
    paddingVertical: 16,
  },
  chatBubble: {
    backgroundColor: T.accentDim,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  chatSender: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.accent,
    marginBottom: 2,
  },
  chatMsgText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
  },
  chatSendBtn: {
    backgroundColor: T.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chatSendText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  leaveBtn: {
    backgroundColor: T.dangerDim,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  leaveBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.danger,
  },
});
