import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ProductGrid } from "@/components/products/product-grid";
import { Container } from "@/components/ui/Container";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const products = useQuery(api.products.list);

  if (!products) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Browse our selection of pharmaceutical products
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <ProductGrid
            products={products.map((product) => ({
              id: product._id,
              name: product.name,
              description: product.description,
              unitPrice: product.pricePerUnit,
              boxPrice: product.pricePerUnit * product.itemsPerBox,
              itemsPerBox: product.itemsPerBox,
            }))}
          />
        </div>
      </div>
    </Container>
  );
}
