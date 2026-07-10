import Hero from "@/components/Hero";
import ProductGrid, { PriceFilter } from "@/components/ProductGrid";

type HomePageProps = {
  searchParams: Promise<{
    category?: string;
    price?: string;
  }>;
};

const allowedPriceFilters: PriceFilter[] = [
  "default",
  "lowToHigh",
  "highToLow",
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const selectedCategory = params.category || "all";

  const priceFilter = allowedPriceFilters.includes(params.price as PriceFilter)
    ? (params.price as PriceFilter)
    : "default";

  return (
    <>
      <Hero />
      <ProductGrid
        selectedCategory={selectedCategory}
        priceFilter={priceFilter}
      />
    </>
  );
}