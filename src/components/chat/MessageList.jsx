// src/components/Chat/MessageList.jsx

import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

function MessageList({ messages, isLoading, formatTime }) {
  const messagesEndRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastMessageLengthRef = useRef(0);

  const scrollToBottom = (behavior = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior,
        block: 'end'
      });
    }
  };

  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const lastMessage = messages[messages.length - 1];
    const currentLength = lastMessage?.content?.length || 0;

    if (lastMessage?.isStreaming) {
      const lengthDiff = currentLength - lastMessageLengthRef.current;
      
      if (lengthDiff > 50) {
        scrollToBottom('auto');
        lastMessageLengthRef.current = currentLength;
      }
    } else {
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToBottom('smooth');
        lastMessageLengthRef.current = 0;
      }, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom('smooth');
    }
  }, [isLoading]);

  const hasStreamingMessage = messages.some(msg => msg.isStreaming);
  const shouldShowTypingIndicator = isLoading && !hasStreamingMessage;

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