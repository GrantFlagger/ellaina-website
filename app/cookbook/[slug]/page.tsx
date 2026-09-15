import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import RecipeDetail from "@/components/RecipeDetail";
import Footer from "@/components/Footer";
import { RECIPES, getRecipeById } from "@/lib/recipes";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const recipe = getRecipeById(params.slug);
  if (!recipe) return {};
  return {
    title: recipe.title.el,
    description: recipe.lede.el,
  };
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = getRecipeById(params.slug);
  if (!recipe) notFound();

  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night">
        <RecipeDetail recipe={recipe} />
      </main>
      <Footer />
    </PageTransition>
  );
}