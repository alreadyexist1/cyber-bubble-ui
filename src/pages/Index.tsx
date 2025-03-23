
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-deep-blue to-dark-blue">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 neon-glow-text">
          NeoChat
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          The next generation of real-time chat applications with a sleek, modern interface
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link to="/chat">
              <Button size="lg" className="gradient-button">
                Go to Chat
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="lg" className="gradient-button">
                  Get Started
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" className="bg-white/5 hover:bg-white/10 border-white/10">
                  Try as Guest
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Index;
