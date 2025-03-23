
import React, { useState } from 'react';
import { Check, Heart, MessageSquare, Smile, ThumbsUp } from 'lucide-react';
import UserAvatar from './UserAvatar';

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isRead?: boolean;
  isCurrentUser: boolean;
  replyTo?: Message;
}

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onReply }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  
  const timeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };
  
  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };
  
  const addReaction = (emoji: string) => {
    setReaction(emoji);
    setShowReactions(false);
  };
  
  const handleReply = () => {
    onReply(message);
  };
  
  return (
    <div className={`group flex items-start gap-3 mb-4 w-full ${message.isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!message.isCurrentUser && (
        <UserAvatar name={message.sender.name} image={message.sender.avatar} status="online" size="sm" />
      )}
      
      <div className={`max-w-[75%] ${message.isCurrentUser ? 'order-1' : 'order-2'}`}>
        {message.replyTo && (
          <div className={`rounded-lg px-3 py-2 mb-2 text-xs ${message.isCurrentUser ? 'bg-primary/10 ml-auto' : 'bg-white/10'} backdrop-blur-sm max-w-[90%]`}>
            <div className="font-medium text-foreground/80 mb-1">
              {message.replyTo.sender.name}
            </div>
            <div className="text-foreground/60 line-clamp-1">
              {message.replyTo.content}
            </div>
          </div>
        )}
        
        <div className={`relative rounded-2xl px-4 py-3 transition-all duration-300 ${
          message.isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'glass-panel'
        }`}>
          {!message.isCurrentUser && (
            <div className="font-medium text-sm mb-1">{message.sender.name}</div>
          )}
          
          <p className="text-sm">{message.content}</p>
          
          <div className="flex items-center mt-1 text-xs text-foreground/60 justify-between">
            <span>{timeAgo(message.timestamp)}</span>
            
            {message.isCurrentUser && message.isRead && (
              <span className="flex items-center">
                <Check className="w-3 h-3 text-blue-400" />
                <Check className="w-3 h-3 -ml-1 text-blue-400" />
              </span>
            )}
          </div>
          
          {reaction && (
            <div className="absolute -bottom-3 right-2 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 text-xs shadow-sm">
              {reaction}
            </div>
          )}
          
          <div className={`absolute -top-3 ${message.isCurrentUser ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 shadow-lg">
              <button 
                onClick={handleReply}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
              </button>
              
              <button 
                onClick={toggleReactions}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <Smile className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {showReactions && (
            <div className="absolute -top-12 right-0 bg-background/80 backdrop-blur-md rounded-full p-1 flex items-center gap-1 animate-scale-in z-10 shadow-lg">
              <button 
                onClick={() => addReaction('👍')}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors text-sm"
              >
                👍
              </button>
              <button 
                onClick={() => addReaction('❤️')}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors text-sm"
              >
                ❤️
              </button>
              <button 
                onClick={() => addReaction('😂')}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors text-sm"
              >
                😂
              </button>
              <button 
                onClick={() => addReaction('😮')}
                className="hover:bg-white/10 rounded-full p-1.5 transition-colors text-sm"
              >
                😮
              </button>
            </div>
          )}
        </div>
      </div>
      
      {message.isCurrentUser && (
        <UserAvatar name={message.sender.name} image={message.sender.avatar} status="online" size="sm" />
      )}
    </div>
  );
};

export default MessageBubble;
