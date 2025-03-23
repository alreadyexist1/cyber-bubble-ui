
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';
import UserAvatar from './UserAvatar';
import MessageBubble, { Message as MessageType } from './MessageBubble';
import MessageInput from './MessageInput';
import { useAuth } from '@/hooks/useAuth';
import { MessageService } from '@/services/MessageService';
import { Profile } from '@/services/ProfileService';

interface ChatAreaProps {
  contact: Profile;
}

const ChatArea: React.FC<ChatAreaProps> = ({ contact }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [replyTo, setReplyTo] = useState<MessageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !contact) return;
      
      setIsLoading(true);
      try {
        const conversation = await MessageService.getConversation(user.id, contact.id);
        
        // Transform to the format expected by MessageBubble
        const formattedMessages = conversation.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: {
            id: msg.sender_id,
            name: msg.sender_id === user.id ? 'You' : contact.username,
            avatar: msg.sender_id === user.id ? undefined : contact.avatar_url,
          },
          timestamp: new Date(msg.created_at),
          isRead: msg.is_read,
          isCurrentUser: msg.sender_id === user.id,
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = MessageService.subscribeToMessages((newMsg) => {
      if (
        (newMsg.sender_id === user?.id && newMsg.receiver_id === contact.id) || 
        (newMsg.sender_id === contact.id && newMsg.receiver_id === user?.id)
      ) {
        const formattedMsg: MessageType = {
          id: newMsg.id,
          content: newMsg.content,
          sender: {
            id: newMsg.sender_id,
            name: newMsg.sender_id === user?.id ? 'You' : contact.username,
            avatar: newMsg.sender_id === user?.id ? undefined : contact.avatar_url,
          },
          timestamp: new Date(newMsg.created_at),
          isRead: newMsg.is_read,
          isCurrentUser: newMsg.sender_id === user?.id,
        };
        
        setMessages(prev => [...prev, formattedMsg]);
        
        // Mark message as read if it's not from current user
        if (newMsg.sender_id !== user?.id) {
          MessageService.markAsRead(newMsg.id);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, contact]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) return;
    
    try {
      await MessageService.sendMessage(
        user.id,
        contact.id,
        content
      );
      
      // The message will be added through the subscription
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleReply = (message: MessageType) => {
    setReplyTo(message);
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <UserAvatar 
            name={contact.username} 
            image={contact.avatar_url} 
            status={contact.status as any}
          />
          
          <div>
            <h2 className="font-medium">{contact.username}</h2>
            <p className="text-xs text-foreground/70">
              {getStatusText(contact.status)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg text-foreground/60 mb-2">No messages yet</p>
            <p className="text-sm text-foreground/40">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onReply={handleReply}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Reply indicator */}
      {replyTo && (
        <div className="mx-4 p-3 glass-panel rounded-t-lg animate-slide-in-left flex items-center justify-between">
          <div>
            <div className="text-xs text-foreground/80">
              Replying to {replyTo.sender.name}
            </div>
            <div className="text-sm line-clamp-1">{replyTo.content}</div>
          </div>
          <button 
            onClick={() => setReplyTo(null)}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Message input */}
      <div className="p-4 pt-2">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
