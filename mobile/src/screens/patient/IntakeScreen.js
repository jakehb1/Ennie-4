import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T, fonts } from '../../theme/tokens';
import { useApp } from '../../context/AppContext';
import BodyMap from '../../components/shared/BodyMap';
import Slider from '../../components/shared/Slider';
import Button from '../../components/shared/Button';

const AI_FLOW = [
  {
    id: 'greeting',
    ai: "Hi! I'm Ennie. Let's find out how I can help.\n\nWhat's been bothering you?",
    type: 'freetext',
  },
  {
    id: 'location',
    ai: 'Got it. Can you point to where you feel it?',
    type: 'bodymap',
  },
  {
    id: 'severity',
    ai: 'How severe is it right now?',
    type: 'slider',
  },
  {
    id: 'duration',
    ai: 'How long have you had this?',
    type: 'quickreply',
    options: ['Days', 'Weeks', 'Months', 'Years'],
  },
  {
    id: 'extra',
    ai: 'Anything else I should know?',
    type: 'freetext',
  },
  {
    id: 'done',
    ai: "Great -- I have everything I need. Let me find the best option for you.",
    type: 'done',
  },
];

function ChatBubble({ text, isAI }) {
  return (
    <View
      style={[
        styles.bubble,
        isAI ? styles.bubbleAI : styles.bubbleUser,
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          isAI ? styles.bubbleTextAI : styles.bubbleTextUser,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export default function IntakeScreen({ navigation }) {
  const { addPin, pins, setUserCondition } = useApp();
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [severity, setSeverity] = useState(5);
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [bodyMapSide, setBodyMapSide] = useState('front');
  const scrollRef = useRef(null);

  // Push the first AI message on mount
  useEffect(() => {
    setMessages([{ text: AI_FLOW[0].ai, isAI: true }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showBodyMap, scrollToBottom]);

  const advanceStep = useCallback(
    (userMessage) => {
      const next = currentStep + 1;
      const updatedMessages = [
        ...messages,
        ...(userMessage ? [{ text: userMessage, isAI: false }] : []),
      ];

      if (next < AI_FLOW.length) {
        updatedMessages.push({ text: AI_FLOW[next].ai, isAI: true });
        setMessages(updatedMessages);
        setCurrentStep(next);

        if (AI_FLOW[next].type === 'bodymap') {
          setShowBodyMap(true);
        } else {
          setShowBodyMap(false);
        }
      } else {
        setMessages(updatedMessages);
        setCurrentStep(next);
        setShowBodyMap(false);
      }
    },
    [currentStep, messages],
  );

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');

    if (currentStep === 0) {
      setUserCondition(text);
    }

    advanceStep(text);
  };

  const handleQuickReply = (option) => {
    advanceStep(option);
  };

  const handleBodyMapDone = () => {
    const count = pins.length;
    advanceStep(`Marked ${count} area${count !== 1 ? 's' : ''} on body map`);
  };

  const handleSeverityDone = () => {
    advanceStep(`Severity: ${severity}/10`);
  };

  const handleDone = () => {
    navigation.navigate('Routing');
  };

  const currentFlow = currentStep < AI_FLOW.length ? AI_FLOW[currentStep] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Chat header */}
      <View style={styles.header}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>E</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Ennie AI</Text>
          <Text style={styles.headerSub}>Symptom intake</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Chat messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, i) => (
            <ChatBubble key={i} text={msg.text} isAI={msg.isAI} />
          ))}

          {/* Body map inline */}
          {showBodyMap && currentFlow?.type === 'bodymap' && (
            <View style={styles.bodyMapContainer}>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    bodyMapSide === 'front' && styles.toggleBtnActive,
                  ]}
                  onPress={() => setBodyMapSide('front')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      bodyMapSide === 'front' && styles.toggleTextActive,
                    ]}
                  >
                    Front
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    bodyMapSide === 'back' && styles.toggleBtnActive,
                  ]}
                  onPress={() => setBodyMapSide('back')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      bodyMapSide === 'back' && styles.toggleTextActive,
                    ]}
                  >
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
              <BodyMap
                side={bodyMapSide}
                pins={pins}
                onAddPin={(pin) => addPin({ ...pin, side: bodyMapSide })}
              />
              <Button
                title={`Done (${pins.length} pin${pins.length !== 1 ? 's' : ''})`}
                onPress={handleBodyMapDone}
                style={styles.inlineBtn}
              />
            </View>
          )}

          {/* Severity slider inline */}
          {currentFlow?.type === 'slider' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Severity: {severity}/10</Text>
              <Slider
                value={severity}
                onValueChange={setSeverity}
                minimumValue={0}
                maximumValue={10}
                step={1}
              />
              <View style={styles.sliderScale}>
                <Text style={styles.sliderScaleText}>No pain</Text>
                <Text style={styles.sliderScaleText}>Worst pain</Text>
              </View>
              <Button
                title="Confirm"
                onPress={handleSeverityDone}
                style={styles.inlineBtn}
              />
            </View>
          )}

          {/* Quick replies */}
          {currentFlow?.type === 'quickreply' && (
            <View style={styles.quickReplyRow}>
              {currentFlow.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.quickReplyBtn}
                  onPress={() => handleQuickReply(opt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReplyText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Done state */}
          {currentFlow?.type === 'done' && (
            <Button
              title="Find My Options"
              onPress={handleDone}
              style={styles.inlineBtn}
            />
          )}
        </ScrollView>

        {/* Text input (only for freetext steps) */}
        {currentFlow?.type === 'freetext' && (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your response..."
              placeholderTextColor={T.textDim}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendText}
              returnKeyType="send"
              multiline={false}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={handleSendText}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiAvatarText: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: T.text,
  },
  headerSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textMuted,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  bubbleAI: {
    alignSelf: 'flex-start',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: T.accent,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextAI: {
    color: T.text,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bodyMapContainer: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  toggleText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.textMuted,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 20,
    marginBottom: 10,
  },
  sliderLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
    color: T.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderScaleText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: T.textDim,
  },
  quickReplyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  quickReplyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.accent,
    backgroundColor: T.accentDim,
  },
  quickReplyText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: T.accent,
  },
  inlineBtn: {
    marginTop: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: T.border,
    backgroundColor: T.bg,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: T.text,
    backgroundColor: T.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: T.accent,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
