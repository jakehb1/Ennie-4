import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';

const QUICK_ACTIONS = [
  { id: 'session', label: 'Session issue' },
  { id: 'payment', label: 'Payment help' },
  { id: 'technical', label: 'Technical problem' },
  { id: 'other', label: 'Other' },
];

const AI_RESPONSES = {
  session:
    "I'm sorry to hear you had an issue with your session. Could you tell me more about what happened? If your session showed no improvement, you may be eligible for a refund within 48 hours.",
  payment:
    "I can help with payment questions. Common topics include refunds (processed within 5-7 business days), subscription management, and receipt requests. What specifically do you need help with?",
  technical:
    "Let me help troubleshoot your technical issue. Please try the following: 1) Close and reopen the app, 2) Check your internet connection, 3) Update to the latest version. If the issue persists, I'll connect you with our team.",
  other:
    "I'm here to help! Please describe your question or concern, and I'll do my best to assist you. If I can't resolve it, I'll connect you with a human support agent.",
};

const FAQS = [
  {
    id: '1',
    question: 'How does energy healing work?',
    answer:
      'Energy healing works by a trained healer focusing their intention on the patient\'s condition. Our platform measures results in real-time using self-reported severity scores. In clinical trials at UCI, participants showed statistically significant improvements compared to placebo groups.',
  },
  {
    id: '2',
    question: "What if my session doesn't help?",
    answer:
      "Not every session produces results, and that's normal. Our verified healers have a 75%+ success rate, meaning about 1 in 4 sessions may not show significant improvement. If you had a paid session with no improvement, you're eligible for a full refund within 48 hours.",
  },
  {
    id: '3',
    question: 'How do refunds work?',
    answer:
      'If your paid session shows no measurable improvement, you can request a refund within 48 hours. Refunds are processed within 5-7 business days back to your original payment method. Group session subscriptions can be cancelled anytime.',
  },
  {
    id: '4',
    question: 'Is my data secure?',
    answer:
      "Yes. All health data is encrypted at rest and in transit. We comply with HIPAA guidelines and never sell personal health information. Your session data is anonymized before being used for research purposes. You can delete your account and all data at any time.",
  },
];

export default function SupportScreen() {
  const [messages, setMessages] = useState([
    {
      id: '0',
      type: 'bot',
      text: "Hi there! I'm Ennie's support assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const scrollRef = useRef(null);

  const handleQuickAction = (action) => {
    const userMsg = {
      id: Date.now().toString(),
      type: 'user',
      text: action.label,
    };
    const botMsg = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      text: AI_RESPONSES[action.id],
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
    };
    const botMsg = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      text: "Thanks for your message. Let me look into that for you. If this requires human assistance, please tap 'Talk to a Human' below.",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Support</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Chat area */}
          <View style={styles.chatArea}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.type === 'user'
                    ? styles.userBubble
                    : styles.botBubble,
                ]}
              >
                {msg.type === 'bot' && (
                  <View style={styles.botAvatar}>
                    <Text style={styles.botAvatarText}>E</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bubbleContent,
                    msg.type === 'user'
                      ? styles.userBubbleContent
                      : styles.botBubbleContent,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.type === 'user' && styles.userMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}

            {/* Quick actions */}
            {messages.length <= 1 && (
              <View style={styles.quickActions}>
                {QUICK_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionBtn}
                    onPress={() => handleQuickAction(action)}
                  >
                    <Text style={styles.quickActionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Escalation button */}
          <TouchableOpacity style={styles.humanBtn} activeOpacity={0.8}>
            <View style={styles.humanBtnIcon}>
              <Text style={styles.humanBtnIconText}>{'\uD83D\uDC64'}</Text>
            </View>
            <View style={styles.humanBtnContent}>
              <Text style={styles.humanBtnTitle}>Talk to a Human</Text>
              <Text style={styles.humanBtnDesc}>
                Average response time: 5 minutes
              </Text>
            </View>
            <Text style={styles.humanBtnArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          {/* FAQ section */}
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() =>
                  setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                }
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqArrow}>
                  {expandedFaq === faq.id ? '\u25B2' : '\u25BC'}
                </Text>
              </TouchableOpacity>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input area */}
        <SafeAreaView edges={['bottom']} style={styles.inputBar}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your question..."
              placeholderTextColor={T.textDim}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnText}>{'\u2191'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: T.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  chatArea: {
    marginBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  botBubble: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  botAvatarText: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  bubbleContent: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 14,
  },
  userBubbleContent: {
    backgroundColor: T.accent,
    borderBottomRightRadius: 4,
  },
  botBubbleContent: {
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginLeft: 40,
  },
  quickActionBtn: {
    backgroundColor: T.accentDim,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  quickActionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  humanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 28,
  },
  humanBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.warmDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  humanBtnIconText: {
    fontSize: 18,
  },
  humanBtnContent: {
    flex: 1,
  },
  humanBtnTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
  },
  humanBtnDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: T.textMuted,
    marginTop: 2,
  },
  humanBtnArrow: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.textMuted,
  },
  faqTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: T.text,
    marginBottom: 12,
  },
  faqItem: {
    backgroundColor: T.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: T.text,
    flex: 1,
    marginRight: 8,
  },
  faqArrow: {
    fontSize: 10,
    color: T.textMuted,
  },
  faqAnswer: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: T.textMuted,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: T.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
