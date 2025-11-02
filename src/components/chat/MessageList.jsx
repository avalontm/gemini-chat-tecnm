// src/components/Chat/MessageList.jsx

import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

function MessageList({ messages, isLoading, formatTime }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Verificar si hay un mensaje en streaming
  const hasStreamingMessage = messages.some(msg => msg.isStreaming);

  // Solo mostrar TypingIndicator si isLoading es true Y NO hay mensaje streaming
  const shouldShowTypingIndicator = isLoading && !hasStreamingMessage;

  console.log('[MESSAGE LIST] Estado:', {
    isLoading,
    hasStreamingMessage,
    shouldShowTypingIndicator,
    messagesCount: messages.length,
    lastMessage: messages[messages.length - 1]
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <MessageItem 
          key={`${message.id}-${message.content?.length || 0}`}
          message={message} 
          formatTime={formatTime} 
        />
      ))}

      {shouldShowTypingIndicator && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;