import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Pill } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

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


  const cartItems = useQuery(api.cart.get) || [];
  const updateCart = useMutation(api.cart.update);

  const addToCart = async (productId: Id<"products">, isBox: boolean) => {

    const existing = cartItems.find((item) => item.productId === productId && item.isBox === isBox);

    let newItems;

    if (existing) {
      newItems = cartItems.map((item) =>
        item.productId === productId && item.isBox === isBox
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...cartItems, { productId, quantity: 1, isBox }];
    }
    await updateCart({ items: newItems });
  };

  return (
    <Card className="flex flex-col overflow-hidden border-2 transition-colors hover:border-primary/50 pt-0">
      <CardHeader className="border-b bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{name}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Unit Price</span>
            <span className="font-medium">${unitPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Box Price</span>
            <span className="font-medium">${boxPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-primary">
            <span className="text-sm">Items per Box</span>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span className="font-medium">{itemsPerBox}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex flex-col w-full gap-2">
          <Button className="flex-1" onClick={()=>addToCart(id,false)}>Add Units </Button>
          <Button className="flex-1" onClick={()=>addToCart(id,true)}>Add Box</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
