
import React, { useState } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import ThemeToggle from '../components/ui/ThemeToggle';

// Mock contact data
const mockContacts = [
  {
    id: '1',
    name: 'Emma Watson',
    status: 'online' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    lastMessage: {
      content: 'That sounds great! Let me know when you want to meet.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isRead: true,
    },
  },
  {
    id: '2',
    name: 'James Wilson',
    status: 'offline' as const,
    lastMessage: {
      content: 'I just sent you the files. Check your email.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: false,
    },
  },
  {
    id: '3',
    name: 'Sophia Martinez',
    status: 'online' as const,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    lastMessage: {
      content: 'Are we still meeting for coffee tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
    },
    isTyping: true,
  },
  {
    id: '4',
    name: 'Ethan Johnson',
    status: 'away' as const,
    lastMessage: {
      content: "I'll be there in 10 minutes.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: true,
    },
  },
  {
    id: '5',
    name: 'Olivia Brown',
    status: 'busy' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    lastMessage: {
      content: 'Thanks for your help with the project!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
    },
  },
  {
    id: '6',
    name: 'Noah Smith',
    status: 'online' as const,
    lastMessage: {
      content: 'I have some ideas I want to discuss with you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
      isRead: true,
    },
  },
  {
    id: '7',
    name: 'Ava Jones',
    status: 'offline' as const,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    lastMessage: {
      content: "Let me know when you're free to talk.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
    },
  },
];

const Chat = () => {
  const [selectedContactId, setSelectedContactId] = useState<string>(mockContacts[0].id);
  
  const selectedContact = mockContacts.find(contact => contact.id === selectedContactId) || mockContacts[0];
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        contacts={mockContacts} 
        selectedContactId={selectedContactId} 
        onSelectContact={setSelectedContactId} 
      />
      
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <ChatArea contact={selectedContact} />
      </div>
    </div>
  );
};

export default Chat;
