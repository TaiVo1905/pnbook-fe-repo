import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  limit,
  type Unsubscribe,
  getFirestore,
} from 'firebase/firestore';
import { app } from '@/core/configs/firebase.config';

const db = getFirestore(app);
import type { Message } from '../../features/messaging/types/messaging.type';

export const subscribeToMessages = (
  conversationId: string,
  onMessage: (message: Message) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const messagesRef = collection(
      db,
      'conversations',
      conversationId,
      'messages'
    );

    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const message: Message = {
              id: data.id ?? change.doc.id,
              senderId: data.senderId,
              receiverId: data.receiverId,
              content: data.content,
              contentType: data.contentType as 'text' | 'attachment',
              createdAt: data.createdAt,
              status: data.status || 'sent',
            };
            onMessage(message);
          }
        });
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    if (onError) onError(error as Error);
    return () => {};
  }
};

export const getConversationId = (userId1: string, userId2: string): string => {
  const ids = [userId1, userId2].sort();
  return `${ids[0]}:${ids[1]}`;
};

export const subscribeToNotifications = (
  receiverId: string, 
  onUpdate: (notification: any) => void,
  onError: (error: any) => void
) => {
  if (!receiverId) return () => {};

  const notificationsRef = collection(db, 'notifications');

  const q = query(
    notificationsRef,
    where('receiverId', '==', String(receiverId).trim()), 
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data();
        onUpdate({ 
          id: change.doc.id, 
          ...data,
          createdAt: data.createdAt 
        });
      }
    });
  }, (err) => {
    console.error("Lỗi lắng nghe thông báo:", err);
    onError(err);
  });
};