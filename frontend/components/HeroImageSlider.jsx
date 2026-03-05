"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SLIDES = [
  {
    image: "/pasta-dish.png",
    title: "Rustic Tomato Basil Pasta",
    match: "98% MATCH",
    time: "25 mins",
    servings: "2 servings"
  },
  {
    image: "/salad-dish.png",
    title: "Crispy Harvest Bowl",
    match: "95% MATCH",
    time: "15 mins",
    servings: "1 serving"
  },
  {
    image: "/burger-dish.png",
    title: "Gourmet Bean Burger",
    match: "92% MATCH",
    time: "30 mins",
    servings: "2 servings"
  }
];

export default function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 1500); // 1.5 seconds slide as requested
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <Card className="relative w-full max-w-[500px] flex-1 aspect-square md:aspect-4/5 border-4 border-stone-900 bg-stone-200 overflow-hidden py-0 shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-orange-500/20 group">
      {SLIDES.map((slide, index) => (
        <Image
          key={index}
          src={slide.image}
          alt={slide.title}
          width={500}
          height={500}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      <Card className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm border-2 border-stone-900 py-0 transition-opacity duration-300 z-20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">
                {currentSlide.title}
              </h3>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-2 border-green-700 bg-green-50 text-green-700 font-bold"
            >
              {currentSlide.match}
            </Badge>
          </div>
          <div className="flex gap-4 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {currentSlide.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {currentSlide.servings}
            </span>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
}
