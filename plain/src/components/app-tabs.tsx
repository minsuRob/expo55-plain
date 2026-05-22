import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useCallback, useState } from 'react';
import { DynamicColorIOS, Keyboard, Platform, useColorScheme } from 'react-native';

import {
  BottomAccessoryChatBar,
  ChatInputModal,
  useKeyboardHeight,
} from '@/components/bottom-accessory-chat-bar';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const keyboardHeight = useKeyboardHeight();

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    setMessage('');
    Keyboard.dismiss();
    setIsChatOpen(false);
  }, [message]);

  const tintColor =
    Platform.OS === 'ios'
      ? DynamicColorIOS({ dark: colors.text, light: colors.text })
      : colors.text;

  const labelColor =
    Platform.OS === 'ios'
      ? DynamicColorIOS({ dark: colors.text, light: colors.text })
      : colors.text;

  return (
    <>
      <NativeTabs
        backgroundColor={colors.background}
        indicatorColor={colors.backgroundElement}
        labelStyle={{ color: labelColor, selected: { color: colors.text } }}
        minimizeBehavior="onScrollDown"
        tintColor={tintColor}>
        <NativeTabs.BottomAccessory>
          <BottomAccessoryChatBar value={message} onOpenChat={() => setIsChatOpen(true)} />
        </NativeTabs.BottomAccessory>
        <NativeTabs.Trigger name="index" disableTransparentOnScrollEdge>
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'house', selected: 'house.fill' }}
            md="home"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="explore">
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'safari', selected: 'safari.fill' }}
            md="explore"
          />
        </NativeTabs.Trigger>
      </NativeTabs>

      <ChatInputModal
        visible={isChatOpen}
        value={message}
        onChangeText={setMessage}
        onSend={handleSend}
        onClose={handleCloseChat}
        keyboardHeight={keyboardHeight}
      />
    </>
  );
}
