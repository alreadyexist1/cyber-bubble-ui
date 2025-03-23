
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { MessageSquare } from 'lucide-react';

interface ChatBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

const HeroSection: React.FC = () => {
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  
  useEffect(() => {
    // Generate random bubbles for the background
    const generateBubbles = () => {
      const newBubbles: ChatBubble[] = [];
      const count = Math.min(Math.floor(window.innerWidth / 100), 20);
      
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 60,
          speed: 30 + Math.random() * 70,
          opacity: 0.1 + Math.random() * 0.2,
          delay: Math.random() * 5,
        });
      }
      
      setBubbles(newBubbles);
    };
    
    generateBubbles();
    
    window.addEventListener('resize', generateBubbles);
    return () => window.removeEventListener('resize', generateBubbles);
  }, []);
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-deep-blue to-dark-blue">
      {/* Animated bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-white/10 backdrop-blur-md z-0"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            animation: `float ${bubble.speed}s ease-in-out infinite ${bubble.delay}s`,
          }}
        />
      ))}
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center">
          <MessageSquare className="w-8 h-8 text-neon-blue mr-2" />
          <h1 className="text-2xl font-bold neon-glow-text">NeonChat</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/chat" className="text-foreground/80 hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </header>
      
      {/* Hero content */}
      <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col items-center justify-center text-center h-[calc(100vh-140px)]">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          <span className="neon-purple-text">Next-Gen</span> Messaging Experience
        </h1>
        
        <p className="text-xl md:text-2xl max-w-2xl text-foreground/80 mb-12 animate-fade-in [animation-delay:200ms]">
          Connect with anyone, anywhere with stunning visuals and seamless interactions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:400ms]">
          <Link 
            to="/login" 
            className="gradient-button"
          >
            Get Started
          </Link>
          
          <Link 
            to="/chat" 
            className="px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-all duration-300"
          >
            Try Demo
          </Link>
        </div>
        
        {/* Feature indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl animate-fade-in [animation-delay:600ms]">
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Stunning UI</h3>
            <p className="text-foreground/70 text-sm">Beautifully designed interface with seamless animations</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 012.5 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Messaging</h3>
            <p className="text-foreground/70 text-sm">Instant message delivery with read receipts</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-neon-pink">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Full Responsiveness</h3>
            <p className="text-foreground/70 text-sm">Perfect experience on any device, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
