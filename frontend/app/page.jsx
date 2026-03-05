import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Star, Flame, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { SITE_STATS, FEATURES } from "@/lib/data";
import PricingSection from "@/components/PricingSection";
import HeroImageSlider from "@/components/HeroImageSlider";
import AnimatedStat from "@/components/AnimatedStat";
import HowItWorksSection from "@/components/HowItWorksSection";
import ScrollProgressLine from "@/components/ScrollProgressLine";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free"; // Replace with actual subscription tier logic
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 relative">
      <ScrollProgressLine />
      {/* Global Pattern: Subtle Foodie Theme Background representing culinary colors */}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
         <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-orange-600/5 rounded-full blur-[120px] -translate-x-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[60vw] h-[60vw] bg-green-500/5 rounded-full blur-[150px] translate-y-1/3" />
         
         {/* Subtle culinary noise pattern to emulate raw kitchen textures */}
         <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="relative inline-flex overflow-hidden rounded-full p-[2px] mb-4">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ea580c_0%,#fde047_50%,#ea580c_100%)]" />
                <Badge
                  variant="outline"
                  className="inline-flex h-full w-full items-center justify-center rounded-full bg-stone-50 px-3 py-1 text-sm font-bold uppercase tracking-wide text-orange-700 backdrop-blur-3xl border-none"
                >
                  <Flame className="mr-1" />
                  #1 AI Cooking Assistant
                </Badge>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-stone-900 to-stone-600">
                Turn your{" "}
                <span className="underline decoration-4 decoration-orange-500 inline-block animate-run-and-hit text-orange-600">
                  leftovers
                </span>{" "}
                into <br />
                masterpieces.
              </h1>
              <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-lg mx-auto md:mx-0 font-light">
                Snap a photo of your fridge. We&apos;ll tell you what to cook.
                Save money, reduce waste, and eat better tonight.
              </p>
              <Link href="/dashboard">
                <Button
                  size="xl"
                  variant="primary"
                  className="px-8 py-6 text-lg shadow-xl shadow-orange-600/20 hover:shadow-orange-600/40 transition-all hover:-translate-y-1"
                >
                  Start Cooking Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <p className="mt-6 text-sm text-stone-500">
                <span className="font-bold border-b border-stone-300 pb-0.5 text-stone-800">10k+ cooks</span>{" "}
                joined last month
              </p>
            </div>
            <HeroImageSlider />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y-2 border-stone-900 bg-stone-900 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, i) => (
            <div key={i} className="group cursor-default">
              <div className="text-4xl font-black mb-1 text-stone-50 tracking-tighter group-hover:text-amber-400 transition-colors">
                <AnimatedStat value={stat.val} />
              </div>
              <Badge
                variant="secondary"
                className="bg-transparent text-stone-400 group-hover:text-amber-500 text-sm uppercase tracking-widest font-bold border-none transition-colors"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[500px] bg-orange-400/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 text-orange-600 border-orange-200 bg-orange-50 font-bold tracking-widest uppercase shadow-sm">
              Core Capabilities
            </Badge>
            <h2 className="text-6xl md:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-stone-900 via-stone-800 to-stone-500 pb-2">
              Your Smart Kitchen
            </h2>
            <p className="text-stone-500 text-xl md:text-2xl font-light">
              Everything you need to master your meal prep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group relative">
                  {/* Glowing hover backdrop */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <Card
                    className="relative h-full border border-stone-200/60 bg-white/80 backdrop-blur-md overflow-hidden rounded-2xl group-hover:border-orange-500/50 group-hover:-translate-y-1 transition-all duration-300 py-0"
                  >
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div className="relative">
                          {/* Animated Icon Container */}
                          <div className="absolute inset-0 bg-orange-100 rounded-xl scale-0 group-hover:scale-110 transition-transform duration-300 ease-out origin-center" />
                          <div className="relative border border-stone-200/80 bg-stone-50 p-3.5 rounded-xl group-hover:border-orange-400/0  transition-colors duration-300 z-10">
                            <IconComponent className="w-6 h-6 text-stone-700 group-hover:text-orange-600 transition-colors duration-300" />
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold bg-stone-100/80 text-stone-500 uppercase tracking-widest border border-stone-200 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors"
                        >
                          {feature.limit}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-orange-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-stone-500 text-lg font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Pricing - Now Using Component */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingSection subscriptionTier={subscriptionTier} />
        </div>
      </section>
    </div>
  );
}
