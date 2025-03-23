
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { ProfileService, type Profile } from '@/services/ProfileService';
import { Loader2, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Update the Contact interface to match what Sidebar expects
interface Contact extends Profile {
  name: string; // Add this to satisfy Sidebar's expectations
  avatar?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  isTyping?: boolean;
}

const Chat = () => {
  const { user, signOut } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        const profiles = await ProfileService.getAllProfiles();
        
        // Filter out current user and transform to contacts
        const contactsList = profiles
          .filter(profile => profile.id !== user.id)
          .map(profile => ({
            ...profile,
            name: profile.username || 'Unknown', // Map username to name for Sidebar
            avatar: profile.avatar_url, // Map avatar_url to avatar for Sidebar
            lastMessage: {
              content: "Click to start chatting",
              timestamp: new Date(),
              isRead: true,
            },
          }));
        
        setContacts(contactsList);
        
        // Select first contact if none selected
        if (contactsList.length > 0 && !selectedContactId) {
          setSelectedContactId(contactsList[0].id);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
    
    // Set up subscription to profile changes
    const subscription = ProfileService.subscribeToProfileChanges((updatedProfile) => {
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === updatedProfile.id 
            ? { 
                ...contact, 
                ...updatedProfile,
                name: updatedProfile.username || 'Unknown', // Ensure name is always set
                avatar: updatedProfile.avatar_url // Ensure avatar is mapped correctly
              } 
            : contact
        )
      );
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedContactId]);
  
  const selectedContact = contacts.find(contact => contact.id === selectedContactId);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        contacts={contacts} 
        selectedContactId={selectedContactId} 
        onSelectContact={setSelectedContactId} 
      />
      
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Link 
            to="/profile" 
            className="p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 transition-colors"
            title="Profile"
          >
            <User size={18} />
          </Link>
          
          <button 
            onClick={signOut}
            className="p-2 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
          
          <ThemeToggle />
        </div>
        
        {selectedContact ? (
          <ChatArea contact={selectedContact} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-foreground/60">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
