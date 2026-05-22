import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function useKeyboardHeight() {
  const [height, setHeight] = React.useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return height;
}

type BottomAccessoryChatBarProps = {
  value: string;
  onOpenChat: () => void;
};

export function BottomAccessoryChatBar({ value, onOpenChat }: BottomAccessoryChatBarProps) {
  const placement = NativeTabs.BottomAccessory.usePlacement();

  if (placement === 'inline') {
    return (
      <Pressable
        onPress={onOpenChat}
        style={styles.inlineBar}
        accessibilityLabel="Open chat">
        <ThemedText type="smallBold">💬</ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onOpenChat} style={styles.regularBarPressable}>
      <ThemedView type="backgroundElement" style={styles.regularBar}>
        <ThemedText
          type="small"
          themeColor={value.trim() ? 'text' : 'textSecondary'}
          numberOfLines={1}
          style={styles.previewText}>
          {value.trim() || 'Message...'}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

type ChatInputModalProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onClose: () => void;
  keyboardHeight: number;
};

export function ChatInputModal({
  visible,
  value,
  onChangeText,
  onSend,
  onClose,
  keyboardHeight,
}: ChatInputModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const bottomOffset = keyboardHeight > 0 ? keyboardHeight : insets.bottom;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.inputDock, { bottom: bottomOffset }]}>
          <ThemedView type="backgroundElement" style={styles.regularBar}>
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder="Message..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              returnKeyType="send"
              onSubmitEditing={onSend}
              blurOnSubmit={false}
            />
            <Pressable
              onPress={onSend}
              disabled={!value.trim()}
              style={[styles.sendButton, !value.trim() && styles.sendButtonDisabled]}>
              <ThemedText type="smallBold">Send</ThemedText>
            </Pressable>
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inlineBar: {
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regularBarPressable: {
    width: '100%',
  },
  regularBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  previewText: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  inputDock: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  sendButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
