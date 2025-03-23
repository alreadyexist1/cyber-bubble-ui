
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';
import UserAvatar from './UserAvatar';
import MessageBubble, { Message } from './MessageBubble';
import MessageInput from './MessageInput';

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

interface ChatAreaProps {
  contact: Contact;
}

const ChatArea: React.FC<ChatAreaProps> = ({ contact }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate initial mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey there! How are you doing today?',
        sender: {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        isCurrentUser: false,
      },
      {
        id: '2',
        content: "I'm doing great! Just finished working on that new project. How about you?",
        sender: {
          id: 'current-user',
          name: 'You',
          avatar: undefined,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9), // 1.9 hours ago
        isRead: true,
        isCurrentUser: true,
      },
      {
        id: '3',
        content: "That's awesome! I've been meaning to ask you about that project. Could you share some details when you have time?",
        sender: {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8), // 1.8 hours ago
        isRead: true,
        isCurrentUser: false,
      },
      {
        id: '4',
        content: "Of course! It's a React application with some really cool animations. I'm using Framer Motion for transitions and Tailwind CSS for styling.",
        sender: {
          id: 'current-user',
          name: 'You',
          avatar: undefined,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7), // 1.7 hours ago
        isRead: true,
        isCurrentUser: true,
      },
      {
        id: '5',
        content: "That sounds really interesting! I've been wanting to learn more about Framer Motion. Would you be willing to show me some examples?",
        sender: {
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.6), // 1.6 hours ago
        isRead: true,
        isCurrentUser: false,
      },
    ];
    
    setMessages(mockMessages);
  }, [contact]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: {
        id: 'current-user',
        name: 'You',
      },
      timestamp: new Date(),
      isRead: false,
      isCurrentUser: true,
      replyTo: replyTo || undefined,
    };
    
    setMessages([...messages, newMessage]);
    setReplyTo(null);
    
    // Simulate response after a delay
    if (messages.length < 10) {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: getRandomResponse(),
          sender: {
            id: contact.id,
            name: contact.name,
            avatar: contact.avatar,
          },
          timestamp: new Date(),
          isCurrentUser: false,
        };
        
        setMessages(prev => [...prev, response]);
      }, 2000 + Math.random() * 3000);
    }
  };
  
  const handleReply = (message: Message) => {
    setReplyTo(message);
  };
  
  const getRandomResponse = (): string => {
    const responses = [
      "That's interesting! Tell me more.",
      "I see what you mean. How do you think we should proceed?",
      "Great point! I hadn't considered that perspective.",
      "Thanks for sharing that with me!",
      "I completely agree with your assessment.",
      "I have some thoughts on that. Let's discuss it further.",
      "That's a clever approach to the problem.",
      "I appreciate your insight on this matter.",
      "Let me think about that for a bit.",
      "You've given me something to consider!",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <UserAvatar 
            name={contact.name} 
            image={contact.avatar} 
            status={contact.status}
          />
          
          <div>
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-xs text-foreground/70">
              {contact.status === 'online' ? 'Online' : 'Offline'}
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
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onReply={handleReply}
          />
        ))}
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
