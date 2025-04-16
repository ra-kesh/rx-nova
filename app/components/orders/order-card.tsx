import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportIssueDialog } from "./report-issue-dialog";

export function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(order._creationTime, "PPP")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                order.status === "completed"
                  ? "success"
                  : order.status === "issues"
                  ? "destructive"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.isBox}`}
                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity}x</span>
                      <span>{item.product?.name}</span>
                      {item.isBox && (
                        <Badge variant="outline" className="text-xs">
                          Box
                        </Badge>
                      )}
                    </div>
                    <span>
                      ₹{item.product?.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {order.issues?.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-destructive/10 p-4 rounded-lg space-y-2"
                >
                  <h4 className="font-medium text-destructive">
                    Reported Issue
                  </h4>
                  <p className="text-sm">{issue.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Reported on {format(issue._creationTime, "PPP")}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                </div>
                {order.status === "completed" && !order.issues?.length && (
                  <ReportIssueDialog orderId={order._id} />
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
