import React from "react";
import { Globe, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getRecipeOfTheDay,
  getCategories,
  getAreas,
} from "@/actions/mealdb.actions";
import { getCategoryEmoji, getCountryFlag } from "@/lib/data";

export default async function DashboardPage() {
  // Fetch data server-side
  const recipeData = await getRecipeOfTheDay();
  const categoriesData = await getCategories();
  const areasData = await getAreas();

  const recipeOfTheDay = recipeData?.recipe;
  const categories = categoriesData?.categories || [];
  const areas = areasData?.areas || [];

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 relative">
      {/* Global Pattern: Subtle Foodie Theme Background representing culinary colors */}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
         <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-orange-600/5 rounded-full blur-[120px] -translate-x-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[60vw] h-[60vw] bg-green-500/5 rounded-full blur-[150px] translate-y-1/3" />
         <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 text-center md:text-left">
          <Badge variant="outline" className="mb-4 text-orange-600 border-none bg-orange-100 font-bold tracking-widest uppercase shadow-sm">
            Your Kitchen
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-stone-900 via-stone-800 to-stone-500 mb-4 tracking-tighter leading-tight pb-2">
            Fresh Recipes, Servd Daily <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">🔥</span>
          </h1>

          <p className="text-xl text-stone-600 font-light max-w-2xl mx-auto md:mx-0">
            Discover thousands of recipes from around the world. Cook, create,
            and savor.
          </p>
        </div>

        {/* Recipe of the Day - Hero Section */}
        {recipeOfTheDay && (
          <section className="mb-32 relative group cursor-pointer" title="View Today's Recipe">
            <Link href={`/recipe?cook=${encodeURIComponent(recipeOfTheDay.strMeal)}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-600 animate-pulse" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  Recipe of the Day
                </h2>
              </div>
              
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                
                <div className="absolute top-6 left-6 z-10">
                  <Badge className="bg-white/90 text-orange-600 border-none shadow-lg font-bold uppercase tracking-widest py-1 px-3">
                    <Flame className="mr-1 w-4 h-4" /> Today&apos;s Special
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative aspect-square md:aspect-auto h-[400px] md:h-auto overflow-hidden">
                    <Image
                      src={recipeOfTheDay.strMealThumb}
                      alt={recipeOfTheDay.strMeal}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/40 via-transparent to-transparent hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-14 flex flex-col justify-center bg-white/40 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50/80 font-bold backdrop-blur-md">
                        {recipeOfTheDay.strCategory}
                      </Badge>
                      <Badge variant="outline" className="border-stone-200 text-stone-700 bg-white/80 font-bold backdrop-blur-md">
                        <Globe className="w-3 h-3 mr-1" />
                        {recipeOfTheDay.strArea}
                      </Badge>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 transition-all leading-tight">
                      {recipeOfTheDay.strMeal}
                    </h3>

                    <p className="text-stone-500 mb-8 line-clamp-3 text-lg leading-relaxed">
                      {recipeOfTheDay.strInstructions?.substring(0, 200)}...
                    </p>

                    <Button className="w-fit bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-6 rounded-xl shadow-xl shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-all">
                      Start Cooking <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Browse by Categories */}
        <section className="mb-32 relative">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-400/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
          
          <div className="mb-10 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-3 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-stone-500 text-xl font-light">
              Find recipes that match your mood
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
            {categories.map((category) => (
              <Link
                key={category.strCategory}
                href={`/recipes/category/${category.strCategory.toLowerCase()}`}
              >
                <div className="bg-white/70 backdrop-blur-md p-6 border border-stone-200/50 rounded-2xl hover:bg-white hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 text-center group cursor-pointer hover:-translate-y-2">
                  <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out drop-shadow-sm">
                    {getCategoryEmoji(category.strCategory)}
                  </div>
                  <h3 className="font-bold text-stone-700 group-hover:text-orange-600 transition-colors text-sm uppercase tracking-wide">
                    {category.strCategory}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Browse by Cuisine */}
        <section className="pb-16 relative">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
          
          <div className="mb-10 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-3 tracking-tight">
              Explore World Cuisines
            </h2>
            <p className="text-stone-500 text-xl font-light">
              Travel the globe through food
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
            {areas.map((area) => (
              <Link
                key={area.strArea}
                href={`/recipes/cuisine/${area.strArea.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="bg-stone-50/80 backdrop-blur-sm p-5 border border-stone-200/80 rounded-2xl hover:bg-white hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group cursor-pointer flex items-center gap-4 hover:-translate-y-1">
                  <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300">
                    {getCountryFlag(area.strArea)}
                  </div>
                  <span className="font-bold text-stone-700 group-hover:text-orange-600 transition-colors text-sm md:text-base">
                    {area.strArea}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}