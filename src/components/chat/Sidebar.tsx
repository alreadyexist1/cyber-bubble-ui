
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, Plus, Search, Settings, User } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface Contact {
  id: string;
  name: string;
  username?: string; // Make this compatible with the profile data
  avatar?: string;
  avatar_url?: string; // Make this compatible with the profile data
  status: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  isTyping?: boolean;
}

interface SidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  contacts, 
  selectedContactId, 
  onSelectContact 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  return (
    <div 
      className={`h-full flex flex-col bg-sidebar transition-all duration-300 ease-in-out border-r border-white/10 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <h2 className="text-xl font-semibold">Messages</h2>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          {!isCollapsed && (
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className={`px-4 py-3 ${isCollapsed ? 'hidden' : ''}`}>
        <div className={`relative transition-all duration-300 ${
          isSearchFocused ? 'bg-white/10' : 'bg-white/5'
        } rounded-full overflow-hidden border border-white/10`}>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full bg-transparent py-2 pl-10 pr-4 focus:outline-none text-sm"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" />
        </div>
      </div>
      
      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredContacts.map((contact) => (
          <div 
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`flex items-center gap-3 p-3 transition-all duration-200 cursor-pointer ${
              contact.id === selectedContactId 
                ? 'bg-white/10 border-l-2 border-primary' 
                : 'hover:bg-white/5 border-l-2 border-transparent'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="relative">
              <UserAvatar 
                name={contact.name} 
                image={contact.avatar} 
                status={contact.status}
                size={isCollapsed ? 'md' : 'sm'}
              />
              
              {contact.lastMessage && !contact.lastMessage.isRead && !isCollapsed && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                  
                  {contact.lastMessage && (
                    <span className="text-xs text-foreground/60">
                      {formatTimestamp(contact.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-foreground/70 truncate">
                  {contact.isTyping ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    contact.lastMessage?.content
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/10 p-3 flex justify-center">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        
        {!isCollapsed && (
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors ml-auto">
            <User className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
