import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import RecipeDetail from "@/components/RecipeDetail";
import JsonLd from "@/components/JsonLd";
import { RECIPES, getRecipeById } from "@/lib/recipes";
import { SITE_URL, SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const recipe = getRecipeById(params.slug);
  if (!recipe) return {};
  return pageMetadata({
    title: `${recipe.title.el} — Συνταγή`,
    description: recipe.lede.el,
    path: `/cookbook/${recipe.id}`,
    image: `/og/recipes/${recipe.id}.jpg`,
    imageAlt: recipe.title.el,
    type: "article",
  });
}

// Recipe times are stored as e.g. "60'" (minutes) → ISO 8601 "PT60M".
const toIsoDuration = (time: string) => {
  const minutes = parseInt(time, 10);
  return Number.isNaN(minutes) ? undefined : `PT${minutes}M`;
};

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = getRecipeById(params.slug);
  if (!recipe) notFound();

  const url = absoluteUrl(`/cookbook/${recipe.id}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: recipe.title.el,
      description: recipe.lede.el,
      image: [absoluteUrl(recipe.image), absoluteUrl(`/og/recipes/${recipe.id}.jpg`)],
      author: { "@type": "Organization", name: SITE_NAME },
      inLanguage: "el",
      recipeCategory: recipe.tag.el,
      recipeCuisine: "Ελληνική",
      recipeYield: recipe.servings.el,
      totalTime: toIsoDuration(recipe.time),
      recipeIngredient: recipe.ingredients.map((i) => `${i.q.el} ${i.el}`),
      recipeInstructions: recipe.steps.map((step) => ({ "@type": "HowToStep", text: step.el })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Αρχική", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Συνταγές", item: absoluteUrl("/cookbook") },
        { "@type": "ListItem", position: 3, name: recipe.title.el, item: url },
      ],
    },
  ];

  return (
    <PageTransition>
      <JsonLd data={jsonLd} />
      <main className="bg-cream dark:bg-night">
        <RecipeDetail recipe={recipe} />
      </main>
    </PageTransition>
  );
}
