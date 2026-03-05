import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecipeCard({ recipe, variant = "default" }) {
  // Handle different recipe data structures
  const getRecipeData = () => {
    // For MealDB recipes (category/cuisine pages)
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }

    // For AI-generated pantry recipes
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl, // Add image support
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl, // Show if image exists
      };
    }

    // For Strapi recipes (saved recipes, search results)
    if (recipe) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    return {};
  };

  const data = getRecipeData();

  // Variant: grid (for category/cuisine pages with images)
  if (variant === "grid") {
    return (
      <Link href={data.href}>
        <Card className="rounded-xl overflow-hidden border border-stone-200/70 bg-white/60 backdrop-blur-md hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group pt-0">
          {/* Image */}
          {data.showImage ? (
            <div className="relative aspect-square border-b border-stone-200/50">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/90 text-sm font-light tracking-wide">
                    View full recipe →
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Fallback elegant background when no image
            <div className="relative aspect-square bg-stone-100 flex items-center justify-center border-b border-stone-200/50 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-200 opacity-50" />
              <ChefHat className="w-16 h-16 text-stone-300 group-hover:scale-110 group-hover:text-stone-400 transition-all duration-700 ease-out relative z-10" />
            </div>
          )}

          {/* Title */}
          <CardHeader className="p-5">
            <CardTitle className="text-lg font-serif text-stone-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {data.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  // Variant: pantry (for AI-generated suggestions with match percentage)
  if (variant === "pantry") {
    return (
      <Card className="rounded-xl border border-stone-200/70 bg-white/60 backdrop-blur-md hover:bg-white hover:border-emerald-200/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
        {/* Image at top (if available) */}
        {data.showImage && (
          <div className="relative aspect-video border-b border-stone-200/50 overflow-hidden">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Match Percentage Badge on Image */}
            {data.matchPercentage && (
              <div className="absolute top-4 right-4 text-center">
                <Badge
                  className="bg-white/90 backdrop-blur-sm text-stone-800 border border-stone-200 shadow-sm px-3 py-1.5"
                >
                  <span className={`font-bold mr-1 ${
                    data.matchPercentage >= 90
                      ? "text-emerald-600"
                      : data.matchPercentage >= 75
                      ? "text-amber-600"
                      : "text-stone-500"
                  }`}>{data.matchPercentage}%</span>
                  <span className="font-light text-xs uppercase tracking-wider">Match</span>
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2.5 mb-3">
                {data.cuisine && (
                  <span className="px-2.5 py-1 bg-white border border-stone-200/80 text-stone-500 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {data.cuisine}
                  </span>
                )}
                {data.category && (
                  <span className="px-2.5 py-1 bg-white border border-stone-200/80 text-stone-500 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {data.category}
                  </span>
                )}
              </div>
            </div>
            {/* Match Percentage Badge (if no image) */}
            {!data.showImage && data.matchPercentage && (
              <div className="flex flex-col items-end gap-1 px-3 py-1.5 bg-white rounded-lg border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <span className={`text-lg font-serif ${
                    data.matchPercentage >= 90
                      ? "text-emerald-700"
                      : data.matchPercentage >= 75
                      ? "text-amber-700"
                      : "text-stone-600"
                  }`}>{data.matchPercentage}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Match</span>
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-serif text-stone-800 group-hover:text-emerald-700 transition-colors leading-tight">
            {data.title}
          </CardTitle>

          {data.description && (
            <CardDescription className="text-stone-500 font-light leading-relaxed mt-3 line-clamp-2 text-sm md:text-base">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-5 flex-1 border-t border-stone-200/60 pt-5 mt-auto">
          {/* Time & Servings */}
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="flex gap-6 text-sm text-stone-500">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-2 group-hover:text-stone-700 transition-colors">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">
                    {parseInt(data.prepTime || 0) +
                      parseInt(data.cookTime || 0)}{" "}
                    mins
                  </span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-2 group-hover:text-stone-700 transition-colors">
                  <Users className="w-4 h-4 text-stone-400" />
                  <span className="font-medium">{data.servings} servings</span>
                </div>
              )}
            </div>
          )}

          {/* Missing Ingredients */}
          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="p-4 bg-white rounded-xl border border-stone-200/50 shadow-sm mt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2.5">
                Missing Provisions:
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.missingIngredients.map((ingredient, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-stone-50 text-stone-600 text-xs font-medium border border-stone-200/50 rounded"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0">
          <Link href={data.href} className="w-full">
            <Button className="w-full bg-stone-800 hover:bg-emerald-700 text-white shadow-sm transition-colors duration-300 font-medium text-sm md:text-base py-5 rounded-lg border-transparent">
              Proceed to Recipe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Variant: list (for saved recipes, search results)
  if (variant === "list") {
    return (
      <Link href={data.href}>
        <Card className="rounded-xl border border-stone-200/70 bg-white/60 backdrop-blur-md hover:bg-white/80 hover:border-emerald-200/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group overflow-hidden py-0 h-full flex flex-col">
          {/* Image (if available) - Adjusted width for better proportion */}
          {data.showImage ? (
            <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden border-b border-stone-200/50">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
              />
            </div>
          ) : (
            // Fallback background when no image
            <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-stone-100 flex items-center justify-center overflow-hidden border-b border-stone-200/50">
              <ChefHat className="w-16 h-16 text-stone-300 group-hover:scale-110 group-hover:text-stone-400 transition-all duration-700 ease-out" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 py-5 px-6 md:px-7 flex flex-col bg-white/20">
              <CardHeader className="p-0 mb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.cuisine && (
                    <span className="px-2.5 py-1 bg-white border border-stone-200/80 text-emerald-800 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {data.cuisine}
                    </span>
                  )}
                  {data.category && (
                    <span className="px-2.5 py-1 bg-white border border-stone-200/80 text-stone-600 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {data.category}
                    </span>
                  )}
                </div>

                <CardTitle className="text-2xl md:text-3xl font-serif text-stone-800 group-hover:text-emerald-700 transition-colors leading-tight">
                  {data.title}
                </CardTitle>

                {data.description && (
                  <CardDescription className="line-clamp-2 mt-2 text-stone-500 font-light text-sm md:text-base leading-relaxed">
                    {data.description}
                  </CardDescription>
                )}
              </CardHeader>

              {(data.prepTime || data.cookTime || data.servings) && (
                <CardContent className="p-0 mt-auto">
                  <div className="flex gap-6 text-sm text-stone-500 pt-4 border-t border-stone-200/60 w-full mt-2">
                    {(data.prepTime || data.cookTime) && (
                      <div className="flex items-center gap-2 group-hover:text-stone-700 transition-colors">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span className="font-medium">
                          {parseInt(data.prepTime || 0) + parseInt(data.cookTime || 0)} mins
                        </span>
                      </div>
                    )}
                    {data.servings && (
                      <div className="flex items-center gap-2 group-hover:text-stone-700 transition-colors">
                        <Users className="w-4 h-4 text-stone-400" />
                        <span className="font-medium">{data.servings} servings</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </div>
        </Card>
      </Link>
    );
  }

  // Default variant (fallback)
  return (
    <Link href={data.href}>
      <Card className="rounded-none border-stone-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden py-0">
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{data.title}</CardTitle>
          {data.description && (
            <CardDescription className="line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}