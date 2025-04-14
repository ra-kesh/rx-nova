import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Container } from "@/components/ui/Container";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }
  },
});

// Temporary mock data - will be replaced with Convex data later
const mockProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain relief and fever reduction tablets",
    unitPrice: 0.5,
    boxPrice: 12.0,
    itemsPerBox: 30,
  },
  {
    id: "2",
    name: "Vitamin C 1000mg",
    description: "Immune system support supplements",
    unitPrice: 0.75,
    boxPrice: 18.0,
    itemsPerBox: 30,
  },
  // Add more mock products as needed
];

function Home() {
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
        {/* <div className="w-full md:w-[200px] lg:w-[280px]">
          <ProductFilters />
        </div> */}
        <div className="flex-1">
          <ProductGrid products={mockProducts} />
        </div>
      </div>
    </Container>
  );
}
