"use client";

import { useEffect, useState, useRef } from "react";
import { HOW_IT_WORKS_STEPS } from "@/lib/data";

export default function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-stone-950 text-stone-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className={`text-6xl md:text-8xl font-black mb-24 text-center tracking-tighter w-fit mx-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-stone-500">Cook in </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">3 Steps</span>
        </h2>

        <div className="space-y-16 relative">
          <div className={`absolute left-[38px] md:left-[58px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange-600/50 via-stone-800 to-transparent hidden sm:block transition-opacity duration-1000 ${isVisible ? 'opacity-100 delay-1000' : 'opacity-0'}`} />

          {HOW_IT_WORKS_STEPS.map((item, i) => (
            <div 
              key={i} 
              className={`group relative flex flex-col sm:flex-row gap-8 sm:gap-12 items-start transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
              style={{ transitionDelay: isVisible ? `${1000 + (i * 200)}ms` : '0ms' }}
            >
              <div className="relative z-10 flex shrink-0">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl bg-stone-900 border-2 border-stone-800 flex items-center justify-center shrink-0 group-hover:bg-orange-600/10 group-hover:border-orange-500 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-2xl overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <span className="text-5xl md:text-7xl font-black text-stone-800 group-hover:text-orange-500 transition-colors duration-500">
                     {item.step}
                   </span>
                </div>
              </div>
              <div className="pt-2 md:pt-6 flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-stone-100 group-hover:text-orange-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-xl md:text-2xl text-stone-400 font-light leading-relaxed group-hover:text-stone-300 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
