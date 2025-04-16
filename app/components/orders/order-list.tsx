import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { useState } from "react";

interface OrderListProps {
  status: "pending" | "completed" | "issues";
}

export function OrderList({ status }: OrderListProps) {
  const orders = useQuery(api.orders.listByUser);
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<Id<"orders"> | null>(null);
  const createIssue = useMutation(api.issues.create);

  const handleReportIssue = async (orderId: Id<"orders">) => {
    try {
      setIsSubmitting(true);
      await createIssue({
        orderId,
        description: issueDescription,
      });

      toast.success("Issue reported successfully");
      setIssueDescription("");
      setActiveOrderId(null);
    } catch (error) {
      toast.error("Failed to report issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders =
    orders?.filter((order) => order.status === status) || [];

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
                  <CardDescription>
                    Placed on {format(order._creationTime, "PPP")}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    status === "completed"
                      ? "success"
                      : status === "issues"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.isBox}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}x</span>
                      <span>{item.product?.name}</span>
                      {item.isBox && <Badge variant="outline">Box</Badge>}
                    </div>
                    <span>
                      ₹{item.product?.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <>
              
              {status === "completed" && (
                <Dialog
                  open={activeOrderId === order._id}
                  onOpenChange={(open) => {
                    if (!open) setActiveOrderId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setActiveOrderId(order._id)}
                    >
                      Report Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Describe the issue you're experiencing with this order.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Describe your issue..."
                      className="min-h-[100px]"
                      disabled={isSubmitting}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setActiveOrderId(null)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleReportIssue(order._id)}
                        disabled={!issueDescription.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⚪</span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Issue"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}</>
              <div className="text-lg font-semibold ml-auto">
                Total: ₹{order.totalAmount.toLocaleString("en-IN")}
              </div>
            
           
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No {status} orders found</p>
        </div>
      )}
    </div>
  );
}
