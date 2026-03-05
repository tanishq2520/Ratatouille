"use client";

import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";

export default function ScrollProgressLine() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page the user has scrolled
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate max scrollable area
      const maxScroll = documentHeight - windowHeight;
      
      if (maxScroll <= 0) {
        setScrollPercentage(0);
        return;
      }

      // Calculate percentage and cap between 0 and 100
      let percentage = (scrollTop / maxScroll) * 100;
      percentage = Math.min(100, Math.max(0, percentage));
      
      setScrollPercentage(percentage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 h-[70vh] w-[40px] z-40 hidden xl:flex justify-center pointer-events-none">
      {/* Background SVG wavy track */}
      <div 
        className="absolute top-0 w-[12px] h-full bg-repeat-y opacity-30 invert dark:invert-0" 
        style={{ backgroundImage: "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCA0MCcgd2lkdGg9JzEyJyBoZWlnaHQ9JzQwJz48cGF0aCBkPSJNMTAgMFEyMCAxMCwgMTAgMjBUMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q2ZDNkMSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=\")" }} 
      />
      
      {/* Active Glowing Wavy line */}
      <div className="absolute top-0 w-[12px] h-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full bg-repeat-y transition-all duration-150 ease-out z-10 filter drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]"
          style={{ 
            height: `${scrollPercentage}%`,
            backgroundImage: "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCA0MCcgd2lkdGg9JzEyJyBoZWlnaHQ9JzQwJz48cGF0aCBkPSJNMTAgMFEyMCAxMCwgMTAgMjBUMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VhNTgwYyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=\")" 
          }}
        />
      </div>
      
      {/* The glowing circle indicator that follows the progress */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-2 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all duration-150 ease-out text-orange-500 z-20"
        style={{ top: `calc(${scrollPercentage}% - 20px)` }}
      >
        <ChefHat 
          className="w-5 h-5 transition-transform duration-100" 
          style={{ transform: `rotate(${scrollPercentage * 6}deg)` }}
        />
        
        {/* Animated steam bubbles trailing behind */}
        {scrollPercentage > 0 && scrollPercentage < 100 && (
          <>
            <div className="absolute top-[-15px] left-0 w-2 h-2 rounded-full bg-orange-400 blur-[1px] animate-bubble-1" />
            <div className="absolute top-[-25px] right-[-5px] w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px] animate-bubble-2" />
            <div className="absolute top-[-10px] right-[5px] w-2 h-2 rounded-full bg-orange-300 blur-[1px] animate-bubble-3" />
          </>
        )}
      </div>
    </div>
  );
}
