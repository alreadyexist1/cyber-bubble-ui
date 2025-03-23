
import React from 'react';

interface UserAvatarProps {
  name: string;
  image?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  image, 
  status = 'offline',
  size = 'md' 
}) => {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };
  
  // Status indicator colors
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };
  
  // Random background colors based on name
  const colors = [
    'bg-gradient-to-br from-purple-500 to-indigo-600',
    'bg-gradient-to-br from-blue-500 to-teal-500',
    'bg-gradient-to-br from-green-500 to-emerald-600',
    'bg-gradient-to-br from-yellow-500 to-orange-600',
    'bg-gradient-to-br from-pink-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
  ];
  
  // Use name to determine a consistent color
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  
  return (
    <div className="relative inline-block">
      {image ? (
        <div className={`${sizeClasses[size]} overflow-hidden rounded-full`}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-medium transition-transform duration-300 hover:scale-105`}>
          {initials}
        </div>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-background`}>
          <span className={`absolute inset-0 ${statusColors[status]} rounded-full animate-ping opacity-75`}></span>
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
