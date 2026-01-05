import React, { useState } from 'react';
import { uploadMedia, sendMessage } from '../services/messaging.service';
import type { Message } from '../types/messaging.type';

interface UseMessageActionsProps {
  chatId: string;
  onMessageSent?: (message: Message) => void;
  onScrollToBottom?: () => void;
}

export const useMessageActions = ({
  chatId,
  onMessageSent,
  onScrollToBottom,
}: UseMessageActionsProps) => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSendText = async () => {
    if (!input.trim()) return;

    try {
      const res = await sendMessage({
        receiverId: chatId,
        contentType: 'text',
        content: input.trim(),
      });

      if (res?.data) {
        onMessageSent?.(res.data);
        setInput('');
        setTimeout(() => onScrollToBottom?.(), 100);
      }
    } catch (_error) {
      alert('Send message failed');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const key = await uploadMedia(file);
      const res = await sendMessage({
        receiverId: chatId,
        contentType: 'attachment',
        content: key,
      });

      if (res?.data) {
        onMessageSent?.(res.data);
        setTimeout(() => onScrollToBottom?.(), 100);
      }
    } catch (_error) {
      alert('Send image failed');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return {
    input,
    setInput,
    isUploading,
    handleSendText,
    handleImageChange,
  };
};
