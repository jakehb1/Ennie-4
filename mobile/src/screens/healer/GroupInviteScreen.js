import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const MOCK_INVITE = {
  topic: 'Chronic Pain Group Healing',
  description:
    'A guided group session for patients experiencing chronic pain. You will lead energy work for up to 8 participants simultaneously.',
  date: 'Saturday, April 5, 2026',
  time: '7:00 PM - 8:00 PM EST',
  maxParticipants: 8,
  currentSignups: 5,
  compensation: 80,
  expectations: [
    'Lead a 60-minute group energy healing session',
    'Guide participants through body scanning and pain assessment',
    'Provide grounding exercises at the end',
    'Submit a summary report after the session',
  ],
};

export default function GroupInviteScreen({ navigation, route }) {
  const invite = route?.params?.invite || MOCK_INVITE;
  const [responded, setResponded] = useState(null);

  const handleAccept = () => {
    setResponded('accepted');
  };

  const handleDecline = () => {
    setResponded('declined');
  };

  const handleAddToCalendar = () => {
    Alert.alert('Calendar', 'Session added to your calendar.');
  };

  if (responded) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.responseContainer}>
          <View
            style={[
              styles.responseIcon,
              {
                backgroundColor:
                  responded === 'accepted' ? T.greenDim : T.dangerDim,
              },
            ]}
          >
            <Text
              style={[
                styles.responseIconText,
                {
                  color: responded === 'accepted' ? T.green : T.danger,
                },
              ]}
            >
              {responded === 'accepted' ? '\u2713' : '\u2717'}
            </Text>
          </View>
          <Text style={styles.responseTitle}>
            {responded === 'accepted' ? 'Invite Accepted!' : 'Invite Declined'}
          </Text>
          <Text style={styles.responseBody}>
            {responded === 'accepted'
              ? "You're confirmed for this group session. We'll send a reminder 30 minutes before."
              : 'No problem. You can always join future group sessions.'}
          </Text>
          {responded === 'accepted' && (
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={handleAddToCalendar}
              activeOpacity={0.7}
            >
              <Text style={styles.calendarButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('HealerHome')}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Group Session Invite</Text>

        {/* Session Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.topicRow}>
            <View style={styles.topicIcon}>
              <Text style={styles.topicIconText}>{'\u2726'}</Text>
            </View>
            <Text style={styles.topicName}>{invite.topic || MOCK_INVITE.topic}</Text>
          </View>

          <Text style={styles.detailsDescription}>
            {invite.description || MOCK_INVITE.description}
          </Text>

          <View style={styles.detailsDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{MOCK_INVITE.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{MOCK_INVITE.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Participants</Text>
            <Text style={styles.infoValue}>
              {MOCK_INVITE.currentSignups}/{MOCK_INVITE.maxParticipants} signed up
            </Text>
          </View>

          {/* Participant slots visualization */}
          <View style={styles.slotsRow}>
            {Array.from({ length: MOCK_INVITE.maxParticipants }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.slot,
                  i < MOCK_INVITE.currentSignups && styles.slotFilled,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    i < MOCK_INVITE.currentSignups && styles.slotTextFilled,
                  ]}
                >
                  {i < MOCK_INVITE.currentSignups ? '\u2713' : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* What's Expected */}
        <View style={styles.expectationsCard}>
          <Text style={styles.sectionTitle}>What's Expected</Text>
          {MOCK_INVITE.expectations.map((item, i) => (
            <View key={i} style={styles.expectationRow}>
              <View style={styles.expectationDot}>
                <Text style={styles.expectationNum}>{i + 1}</Text>
              </View>
              <Text style={styles.expectationText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Compensation */}
        <View style={styles.compensationCard}>
          <Text style={styles.compensationLabel}>Compensation</Text>
          <Text style={styles.compensationValue}>${MOCK_INVITE.compensation}.00</Text>
          <Text style={styles.compensationMeta}>
            Paid upon session completion and report submission
          </Text>
        </View>

        {/* Calendar Option */}
        <TouchableOpacity
          style={styles.calendarOption}
          onPress={handleAddToCalendar}
          activeOpacity={0.7}
        >
          <Text style={styles.calendarOptionIcon}>{'\u{1F4C5}'}</Text>
          <Text style={styles.calendarOptionText}>Add to Calendar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={handleDecline}
          activeOpacity={0.7}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    paddingTop: 16,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: T.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    marginBottom: 16,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  topicIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIconText: {
    fontSize: 22,
    color: T.accent,
  },
  topicName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    flex: 1,
  },
  detailsDescription: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 21,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: T.border,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  infoValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: T.text,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    justifyContent: 'center',
  },
  slot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    backgroundColor: T.accentDim,
    borderColor: T.accent,
  },
  slotText: {
    fontSize: 12,
    color: T.textDim,
  },
  slotTextFilled: {
    color: T.accent,
    fontWeight: '700',
  },
  expectationsCard: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: T.text,
    marginBottom: 16,
  },
  expectationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  expectationDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expectationNum: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: T.accent,
  },
  expectationText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.text,
    flex: 1,
    lineHeight: 20,
    paddingTop: 2,
  },
  compensationCard: {
    backgroundColor: T.greenDim,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  compensationLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
  },
  compensationValue: {
    fontFamily: fonts.headingBold,
    fontSize: 40,
    color: T.green,
    marginVertical: 4,
  },
  compensationMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
  },
  calendarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 8,
  },
  calendarOptionIcon: {
    fontSize: 18,
  },
  calendarOptionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.text,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.border,
    gap: 12,
  },
  declineButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.danger,
    paddingVertical: 16,
    alignItems: 'center',
  },
  declineButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.danger,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  // Response state styles
  responseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  responseIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  responseIconText: {
    fontSize: 32,
    fontWeight: '700',
  },
  responseTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: T.text,
    marginBottom: 10,
  },
  responseBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  calendarButton: {
    backgroundColor: T.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  calendarButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: T.accent,
  },
});
