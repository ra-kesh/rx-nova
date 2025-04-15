import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

export function CartPopover() {
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
  const cartItems = useQuery(api.cart.get) || [];
  const products = useQuery(api.products.list);
  const updateCart = useMutation(api.cart.update);
  const clearCart = useMutation(api.cart.clear);

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

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const updateQuantity = async (
    productId: Id<"products">,
    isBox: boolean,
    quantity: number
  ) => {
    const key = `${productId}-${isBox}`;
    setIsUpdating(key);
    try {
      if (quantity < 1) {
        await removeFromCart(productId, isBox);
        toast.success("Item removed from cart");
      } else {
        const newItems = cartItems.map((item) =>
          item.productId === productId && item.isBox === isBox
            ? { ...item, quantity }
            : item
        );
        await updateCart({ items: newItems });
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="font-semibold text-lg">Shopping Cart</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={handleClearCart}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <Separator />

          {!products ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading cart...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 text-center"
            >
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items to your cart to see them here
              </p>
            </motion.div>
          ) : (
            <>
              <ScrollArea className="flex-1 h-[320px] px-4">
                <div className="space-y-4 py-4">
                  <AnimatePresence>
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

                      const key = `${item.productId}-${item.isBox}`;
                      const isUpdatingThis = isUpdating === key;

                      return (
                        <motion.div
                          key={key}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
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
                              <span>${itemTotal.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isUpdatingThis}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.isBox,
                                  item.quantity - 1
                                )
                              }
                            >
                              {isUpdatingThis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : item.quantity === 1 ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </Button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="text-sm font-medium w-5 text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isUpdatingThis}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.isBox,
                                  item.quantity + 1
                                )
                              }
                            >
                              {isUpdatingThis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              <motion.div layout className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <motion.span key={totalAmount}>
                      ${totalAmount.toLocaleString("en-IN")}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <motion.span key={totalAmount}>
                      ${totalAmount.toLocaleString("en-IN")}
                    </motion.span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                    Place Order
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
