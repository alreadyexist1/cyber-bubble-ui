
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  image?: string;
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  image, 
  status, 
  size = 'md' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
      default:
        return 'bg-gray-500';
    }
  };
  
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  const statusSizeClass = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  };
  
  return (
    <div className="relative">
      <Avatar className={sizeClass[size]}>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      <span 
        className={`absolute bottom-0 right-0 ${statusSizeClass[size]} rounded-full ring-2 ring-background ${getStatusColor(status)}`}
      />
    </div>
  );
};

export default UserAvatar;
