import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";

export function CartPopover() {
  const cartItems = useQuery(api.cart.get) || [];
  const products = useQuery(api.products.list);
  const updateCart = useMutation(api.cart.update);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => {
    const product = products?.find((p) => p._id === item.productId);
    if (!product) return acc;
    return (
      acc +
      (item.isBox
        ? product.pricePerUnit * product.itemsPerBox * item.quantity
        : product.pricePerUnit * item.quantity)
    );
  }, 0);

  const removeFromCart = async (productId: Id<"products">, isBox: boolean) => {
    const newItems = cartItems.filter(
      (item) => !(item.productId === productId && item.isBox === isBox)
    );
    await updateCart({ items: newItems });
  };

  const updateQuantity = async (
    productId: Id<"products">,
    isBox: boolean,
    quantity: number
  ) => {
    if (quantity < 1) {
      await removeFromCart(productId, isBox);
      return;
    }
    const newItems = cartItems.map((item) =>
      item.productId === productId && item.isBox === isBox
        ? { ...item, quantity }
        : item
    );
    await updateCart({ items: newItems });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="font-semibold text-lg">Shopping Cart</h3>
            <span className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
          <Separator />

          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items to your cart to see them here
              </p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 h-[320px] px-4">
                <div className="space-y-4 py-4">
                  {cartItems.map((item) => {
                    const product = products?.find(
                      (p) => p._id === item.productId
                    );
                    if (!product) return null;

                    const itemTotal = item.isBox
                      ? product.pricePerUnit *
                        product.itemsPerBox *
                        item.quantity
                      : product.pricePerUnit * item.quantity;

                    return (
                      <div
                        key={`${item.productId}-${item.isBox}`}
                        className="flex items-start space-x-4 py-2"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>
                              {item.isBox
                                ? `Box of ${product.itemsPerBox}`
                                : "Single unit"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>₹{itemTotal.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.isBox,
                                item.quantity - 1
                              )
                            }
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="text-sm font-medium w-5 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.isBox,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
