"use client";

import { useEffect } from "react";
import { Bookmark, Loader2, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";

export default function SavedRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const recipes = recipesData?.recipes || [];

  return (
    <div className="min-h-screen bg-stone-50/50 pt-24 pb-16 px-4 relative font-sans">
      {/* Global Pattern: Subtle Foodie Theme Background - Toned down for elegance */}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
         <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-amber-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
         <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] bg-orange-700/5 rounded-full blur-[120px] -translate-x-1/2" />
         <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-emerald-600/5 rounded-full blur-[120px] translate-y-1/3" />
         <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-stone-100 flex-shrink-0">
                <Bookmark className="w-8 h-8 text-stone-700" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight leading-tight">
                  Saved Recipes
                </h1>
                <p className="text-lg text-stone-500 font-light mt-1.5 font-sans">
                  Your personal collection of curated culinary discoveries.
                </p>
              </div>
            </div>
            {/* Meta tags or badges can go here on the right, matching /pantry */}
            {!loading && (
              <div className="hidden md:flex bg-white/70 backdrop-blur-md py-2.5 px-5 rounded-xl border border-stone-200/60 items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <span className="font-serif text-lg text-emerald-700 mr-2">{recipes.length}</span>
                <span className="text-sm font-medium text-stone-600 font-sans tracking-wide uppercase">Recipes Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin mb-4" />
            <p className="font-sans text-stone-500 font-medium">Accessing your collection...</p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.documentId}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 md:p-16 text-center border border-stone-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mt-4">
            <div className="w-20 h-20 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Bookmark className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-2xl font-serif text-stone-800 mb-3 tracking-tight">
              Collection is Empty
            </h3>
            <p className="text-stone-500 text-base max-w-md mx-auto mb-8 font-light">
              Begin by exploring recipes or scanning your pantry, then save your favorites to build your personal cookbook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-stone-800 hover:bg-stone-700 text-white rounded-lg px-8 py-6 text-base font-medium transition-colors shadow-sm gap-2">
                  <ChefHat className="w-5 h-5" />
                  Explore Recipes
                </Button>
              </Link>
              <Link href="/pantry">
                <Button variant="outline" className="border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg px-8 py-6 text-base shadow-sm gap-2">
                  Check Inventory
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}