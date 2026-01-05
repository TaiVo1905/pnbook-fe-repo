import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, SendHorizontal, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useMessaging } from '../hooks/UseMessaging';
import { uploadMedia, sendMessage } from '../services/messaging.service';
import type { Message } from '../types/messaging.type';
const ChatImage: React.FC<{ src: string; onLoaded: () => void }> = ({
  src,
  onLoaded,
}) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-4 text-xs text-gray-400 italic">
        <ImageIcon size={20} className="mb-1 opacity-20" />
        Image unavailable
      </div>
    );
  }
  return (
    <img
      src={src}
      className="block h-auto max-h-[300px] max-w-full min-w-[150px] rounded-lg object-cover shadow-sm"
      alt="attachment"
      onLoad={onLoaded}
      onError={() => setError(true)}
    />
  );
};
const ChatWindow: React.FC<{ chatId: string }> = ({ chatId }) => {
  const {
    messages,
    isLoading,
    fetchMore,
    isFetchingMore,
    hasMore,
    addMessage,
  } = useMessaging(chatId);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if (!isFetchingMore) {
      scrollToBottom();
    }
  }, [messages, isLoading, isFetchingMore]);
  const handleScroll = async () => {
    if (!scrollRef.current) return;
    if (!hasMore || isFetchingMore || isLoading) return;
    if (scrollRef.current.scrollTop === 0) {
      const prevHeight = scrollRef.current.scrollHeight;
      await fetchMore();
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const newHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newHeight - prevHeight;
        }
      });
    }
  };
  const formatTime = (ts?: string) => {
    if (!ts) return 'Just now';
    try {
      const d = formatDistanceToNow(new Date(ts), {
        addSuffix: true,
        locale: enUS,
      });
      return d.includes('less than a minute') ? 'Just now' : d;
    } catch {
      return 'Just now';
    }
  };
  const handleSendText = async () => {
    if (!input.trim()) return;
    try {
      const res = await sendMessage({
        receiverId: chatId,
        contentType: 'text',
        content: input.trim(),
      });

      if (res?.data) {
        addMessage({ ...res.data, isMe: true });
        setInput('');
      }
    } catch {
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
        addMessage({ ...res.data, isMe: true });
      }
    } catch {
      alert('Send image failed');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b bg-white p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white uppercase">
          {chatId.substring(0, 2)}
        </div>
        <span className="font-semibold text-gray-700">Chat</span>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto bg-slate-50/30 p-4"
      >
        {isFetchingMore && (
          <div className="flex justify-center py-2 text-xs text-gray-400">
            <Loader2 className="mr-1 animate-spin" size={14} />
            Loading older messages...
          </div>
        )}
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 className="mr-2 animate-spin" /> Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400 italic">
            No messages yet
          </div>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.isMe === true;
            const isImage = msg.contentType === 'attachment';
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {!isMe && (
                  <div className="mb-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                    {chatId.substring(0, 1).toUpperCase()}
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    isMe ? 'items-end' : 'items-start'
                  } max-w-[75%]`}
                >
                  <div
                    className={`rounded-[20px] px-4 py-2 text-[15px] break-words shadow-sm ${
                      isMe
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none border border-gray-100 bg-white text-gray-800'
                    } ${isImage ? 'overflow-hidden p-1' : ''} `}
                  >
                    {isImage ? (
                      <ChatImage src={msg.content} onLoaded={scrollToBottom} />
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-gray-400">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex items-center gap-3 border-t bg-white p-4">
        <label className="cursor-pointer rounded-full p-2 text-blue-500 transition-colors hover:bg-gray-100">
          {isUploading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <ImageIcon size={22} />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          className="flex-1 rounded-full bg-gray-100 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-400/50"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendText}
          className="rounded-full p-2 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-30"
          disabled={!input.trim()}
        >
          <SendHorizontal size={22} />
        </button>
      </div>
    </div>
  );
};
export default ChatWindow;
