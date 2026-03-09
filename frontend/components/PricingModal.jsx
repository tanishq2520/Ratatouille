"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PricingSection from "./PricingSection";
import { useRouter } from "next/navigation";

export default function PricingModal({ subscriptionTier = "free", children }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Allow opening for both free and pro (so pro can downgrade too)
  const handleOpenChange = (open) => {
    setIsOpen(open);
    // When dialog closes, force a full server-component refresh so the navbar
    // re-reads the (potentially updated) Clerk session / subscriptionTier
    if (!open) {
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="p-8 pt-4 sm:max-w-4xl">
        <DialogTitle />
        <div>
          <PricingSection onPlanChange={() => {
            // After plan change, close modal and force full refresh so server
            // components pick up the new Clerk session
            setIsOpen(false);
            // Small delay to let Clerk propagate the change, then hard reload
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}