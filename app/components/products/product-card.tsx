import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Loader2, ShoppingCart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  id: Id<"products">;
  name: string;
  description: string;
  unitPrice: number;
  boxPrice: number;
  itemsPerBox: number;
  image?: string;
}

export function ProductCard({
  id,
  name,
  description,
  unitPrice,
  boxPrice,
  itemsPerBox,
  image,
}: ProductCardProps) {
  const [loadingType, setLoadingType] = useState<"unit" | "box" | null>(null);
  const cartItems = useQuery(api.cart.get) || [];
  const updateCart = useMutation(api.cart.update);

  const addToCart = async (productId: Id<"products">, isBox: boolean) => {
    setLoadingType(isBox ? "box" : "unit");
    try {
      const existing = cartItems.find(
        (item) => item.productId === productId && item.isBox === isBox
      );

      const newItems = existing
        ? cartItems.map((item) =>
            item.productId === productId && item.isBox === isBox
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cartItems, { productId, quantity: 1, isBox }];

      await updateCart({ items: newItems });
      toast.success(
        `Added ${isBox ? `1 box (${itemsPerBox} units)` : "1 unit"} of ${name}`
      );
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Card className="group overflow-hidden pt-0">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
          <div className="h-full w-full bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
        </AspectRatio>
      </div>

      <CardContent className="grid gap-2.5 p-4">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between ">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Box Price</span>
            <span className="text-xl font-bold">₹{boxPrice}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Package className="h-3 w-3" />
              <span>{itemsPerBox} units per box</span>
            </div>
          </div>

          <div className="flex flex-col mb-auto">
            <span className="text-sm text-muted-foreground">Unit Price</span>
            <span className="text-sm font-medium">
              ₹{unitPrice}&nbsp;/&nbsp;unit
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex-1 transition-colors",
              loadingType === "unit" && "opacity-50"
            )}
            onClick={() => addToCart(id, false)}
            disabled={loadingType !== null}
          >
            {loadingType === "unit" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Add Unit <ShoppingCart className="h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            className={cn("flex-1", loadingType === "box" && "opacity-50")}
            onClick={() => addToCart(id, true)}
            disabled={loadingType !== null}
          >
            {loadingType === "box" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Add Box <ShoppingCart className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
