import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Cookie, Refrigerator, Sparkles, UtensilsCrossed } from "lucide-react";
import { Badge } from "./ui/badge";
import UserDropdown from "./UserDropdown";
import { checkUser } from "@/lib/checkUser";
import PricingModal from "./PricingModal";
import HowToCookModal from "./HowToCookModal";
import { headers } from "next/headers";

// Fetch remaining recipe credits (server-side, no token consumed)
async function getRecipeCredits(user) {
  if (!user || user.subscriptionTier === "pro") {
    return { isPro: true, tokensRemaining: null, capacity: null };
  }

  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/recipe-credits`, {
      cache: "no-store",
      // Forward cookies so auth works
      headers: {
        cookie: headersList.get("cookie") || "",
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch recipe credits:", e);
  }

  // Fail open
  return { isPro: false, tokensRemaining: 5, capacity: 5 };
}

const Header = async () => {
  const user = await checkUser();
  const credits = await getRecipeCredits(user);

  // Credit badge color based on remaining
  const getCreditColor = (remaining) => {
    if (remaining >= 3) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (remaining >= 1) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 animate-in fade-in slide-in-from-top-4 duration-700">
      <nav className="h-16 px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center transition-transform hover:scale-105">
          <Image
            src="/orange.png"
            alt="Ratatouille logo"
            width={70}
            height={70}
            className="w-16 h-16 object-contain drop-shadow-sm -ml-2 mr-1"
          />
          <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent hidden sm:block">
            Ratatouille
          </span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/recipes"
            className="px-4 py-2 hover:bg-orange-50/80 rounded-full text-stone-600 hover:text-orange-600 font-medium transition-all flex gap-2 items-center"
          >
            <Cookie className="w-4 h-4" />
            My Recipes
          </Link>
          <Link
            href="/pantry"
            className="px-4 py-2 hover:bg-orange-50/80 rounded-full text-stone-600 hover:text-orange-600 font-medium transition-all flex gap-2 items-center"
          >
            <Refrigerator className="w-4 h-4" />
            My Pantry
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <SignedIn>
            <HowToCookModal/>

            {/* Recipe Credits Badge — Free users only */}
            {user && !credits.isPro && credits.tokensRemaining !== null && (
              <PricingModal subscriptionTier={user.subscriptionTier}>
                <div
                  title={
                    credits.tokensRemaining === 0
                      ? "No recipe credits left today — upgrade to Pro for unlimited!"
                      : `${credits.tokensRemaining} of ${credits.capacity} daily recipe credits remaining`
                  }
                  className={`flex h-9 px-3 gap-1.5 rounded-full text-sm font-semibold border items-center cursor-pointer transition-all hover:scale-105 select-none ${getCreditColor(credits.tokensRemaining)}`}
                >
                  <UtensilsCrossed className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>
                    {credits.tokensRemaining}/{credits.capacity}
                  </span>
                  <span className="hidden sm:inline text-xs font-medium opacity-80">
                    {credits.tokensRemaining === 1 ? "credit" : "credits"}
                  </span>
                </div>
              </PricingModal>
            )}

            {user && (
              <PricingModal subscriptionTier={user.subscriptionTier}>
                <Badge
                  variant="outline"
                  className={`flex h-9 px-4 gap-2 rounded-full text-sm font-semibold transition-all hover:scale-105 cursor-pointer ${
                    user.subscriptionTier === "pro"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white border-none shadow-orange-500/25 shadow-lg hover:shadow-orange-500/40"
                      : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:border-stone-300"
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      user.subscriptionTier === "pro"
                         ? "text-white fill-white/50 animate-pulse"
                         : "text-stone-500"
                    }`}
                  />
                  <span>
                    {user.subscriptionTier === "pro" ? "Pro Plan" : "Free Plan"}
                  </span>
                </Badge>
              </PricingModal>
            )}

            <div className="pl-2 border-l border-stone-200">
              <UserDropdown />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium rounded-full px-5"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" className="rounded-full px-7 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-shadow">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
