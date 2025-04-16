import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportIssueDialog } from "./report-issue-dialog";
import { ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIssuesExpanded, setIsIssuesExpanded] = useState(false);

  const orderIssues = useQuery(api.issues.listByOrder, { orderId: order._id });

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

              <div className="flex items-center  pt-4 border-t">
                {order.status === "completed" && !order.issues?.length && (
                  <ReportIssueDialog orderId={order._id} />
                )}
                <div className="text-lg font-semibold ml-auto">
                  Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
              {(orderIssues?.length ?? 0) > 0 && (
                <div className="border rounded-md">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setIsIssuesExpanded(!isIssuesExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {orderIssues?.length}{" "}
                        {orderIssues?.length === 1 ? "Issue" : "Issues"}{" "}
                        Reported
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isIssuesExpanded && "rotate-90"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {isIssuesExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t">
                          {orderIssues?.map((issue, index) => (
                            <div
                              key={issue._id}
                              className={cn(
                                "p-4 space-y-2",
                                index !== orderIssues?.length - 1 && "border-b"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  Issue #{issue._id.slice(-4)}
                                </p>
                                <Badge
                                  variant={
                                    issue.status === "resolved"
                                      ? "success"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {issue.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {issue.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Reported on {format(issue._creationTime, "PPP")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
