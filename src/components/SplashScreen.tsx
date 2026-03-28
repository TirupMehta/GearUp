import React, { useEffect, useState } from 'react';
import { ShoppingBasket, Shirt, Watch, Smartphone, Headphones, Gamepad2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome text midway through animation
    const textTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 600);

    // End splash screen after 2.5 seconds
    const endTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Animated container */}
      <div className="flex flex-col items-center justify-center z-10 animate-fadeIn">
        
        {/* Basket and items */}
        <div className="relative mb-12">
          {/* Items popping out of the basket */}
          {/* We position them absolute relative to the basket so they pop out from the center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-emerald-400 animate-popOut" style={{ animationDelay: '0.1s' }}>
            <Shirt className="w-10 h-10 -rotate-12" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-red-400 animate-popOut" style={{ animationDelay: '0.3s' }}>
            <Watch className="w-10 h-10 rotate-12" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-yellow-500 animate-popOut" style={{ animationDelay: '0.5s' }}>
            <Smartphone className="w-10 h-10 -rotate-6" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-purple-400 animate-popOut" style={{ animationDelay: '0.7s' }}>
            <Headphones className="w-10 h-10 rotate-45" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-pink-400 animate-popOut" style={{ animationDelay: '0.9s' }}>
            <Gamepad2 className="w-10 h-10 -rotate-45" />
          </div>

          <div className="relative z-10 bg-background rounded-full p-2">
            <ShoppingBasket className="w-28 h-28 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </div>

        {/* Welcome text */}
        <div className={`transition-all duration-1000 transform ${showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 text-center">
            Welcome to ShopGenie
          </h1>
          <p className="text-text-muted text-center text-lg">Intelligent Retail Operations</p>
        </div>

      </div>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-20 pointer-events-none" />
    </div>
  );
};
