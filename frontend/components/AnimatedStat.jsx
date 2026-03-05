"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedStat({ value }) {
  const [displayValue, setDisplayValue] = useState(
    value.replace(/[0-9]/g, "0")
  );
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Extract the number and non-number parts
    const match = value.match(/([^0-9]*)([0-9.]+)([^0-9]*)/);
    
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const numStr = match[2];
    const suffix = match[3] || "";
    
    const isDecimal = numStr.includes(".");
    const targetNum = parseFloat(numStr);
    
    let startTime = null;
    const duration = 2000; // 2 seconds animation

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentNum = targetNum * easeProgress;
      
      // Slot machine effect: rapidly changing random numbers until near the end
      if (progress < 0.8) {
        // Generate random number with same length
        const randomStr = numStr.split('').map(char => 
          char === '.' ? '.' : Math.floor(Math.random() * 10).toString()
        ).join('');
        setDisplayValue(`${prefix}${randomStr}${suffix}`);
      } else {
        // Smooth transition to final number
        const formattedNum = isDecimal ? currentNum.toFixed(1) : Math.floor(currentNum).toString();
        setDisplayValue(`${prefix}${formattedNum}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure exact final value
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div ref={elementRef} className="tabular-nums">
      {displayValue}
    </div>
  );
}
