"use client";

import { PricingTable, useUser } from "@clerk/nextjs";
import React, { useEffect, useState, useRef } from "react";
import { Badge } from "./ui/badge";

const PricingSection = ({ onPlanChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { user } = useUser();

  // Track the subscription tier so we can detect when it changes
  const prevTierRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Detect plan changes from Clerk's user object and notify parent
  useEffect(() => {
    if (!user) return;

    // Clerk stores subscription metadata in publicMetadata or via has() checks
    // We listen to changes in the user's publicMetadata or sessionClaims
    const currentPlan = user.publicMetadata?.plan ?? "free";

    if (prevTierRef.current !== null && prevTierRef.current !== currentPlan) {
      // Plan has changed — sync with backend and reload
      syncPlanWithBackend(currentPlan).then(() => {
        if (onPlanChange) onPlanChange(currentPlan);
      });
    }

    prevTierRef.current = currentPlan;
  }, [user?.publicMetadata, onPlanChange]);

  // Sync the new plan to Strapi backend
  const syncPlanWithBackend = async (newPlan) => {
    try {
      await fetch("/api/sync-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
    } catch (e) {
      console.error("Failed to sync plan:", e);
    }
  };

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto relative group">
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-r from-orange-500/10 to-amber-300/10 blur-[100px] pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <Badge variant="outline" className="mb-6 text-orange-600 border-orange-200 bg-orange-50 font-bold tracking-widest uppercase shadow-sm">
          Simple Pricing
        </Badge>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-stone-900 to-stone-500 bg-clip-text text-transparent">
          Pick Your Plan
        </h2>
        <p className="text-xl md:text-2xl text-stone-500 font-light max-w-2xl mx-auto">
          Start for free. Upgrade to become a master chef and unlock unlimited culinary magic.
        </p>
      </div>

      <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
         {/* Decorative elements behind the table */}
         <div className="absolute -inset-4 bg-gradient-to-r from-orange-100 to-stone-100 rounded-3xl -z-10 blur-xl opacity-50 transition duration-500 group-hover:opacity-100" />
         <div className="bg-white/60 backdrop-blur-xl border border-white/20 p-2 md:p-6 rounded-3xl shadow-2xl shadow-stone-200/50">
           <PricingTable
             checkoutProps={{
               appearance: {
                 elements: {
                   drawerRoot: {
                     zIndex: 2000,
                   },
                 },
               },
             }}
           />
         </div>
      </div>
    </div>
  );
};

export default PricingSection;
