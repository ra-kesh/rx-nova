import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Pill } from "lucide-react";

interface ProductCardProps {
  id: string;
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
  return (
    <Card className="flex flex-col overflow-hidden border-2 transition-colors hover:border-primary/50">
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
        <div className="flex w-full gap-2">
          <Button className="flex-1">Add to Cart</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
