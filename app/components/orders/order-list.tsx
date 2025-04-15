import * as React from "react";
import { useQuery } from "convex/react";
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

interface OrderListProps {
  status: "pending" | "completed" | "issues";
}

export function OrderList({ status }: OrderListProps) {
  const orders = useQuery(api.orders.listByUser);
  const [issueOrder, setIssueOrder] = React.useState<string | null>(null);
  const [issueDescription, setIssueDescription] = React.useState("");

  console.log({orders})

  const filteredOrders =
    orders?.filter((order) => order.status === status) || [];

  const handleReportIssue = async (orderId: string) => {
    // Implementation for reporting issues
  };

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
                    <span>₹{item.product?.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-lg font-semibold ml-auto">
                Total: ₹{order.totalAmount.toLocaleString("en-IN")}
              </div>
              {status === "completed" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Report Issue</Button>
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
                    />
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => handleReportIssue(order._id)}
                      >
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
