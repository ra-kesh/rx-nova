import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/orders/order-list";
import { OrderStats } from "@/components/orders/order-stats";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your orders in one place
          </p>
        </div>
      </div>

      <OrderStats />

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="pending" className="space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
          <TabsTrigger value="issues" className="space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Issues</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <OrderList status="pending" />
        </TabsContent>
        <TabsContent value="completed">
          <OrderList status="completed" />
        </TabsContent>
        <TabsContent value="issues">
          <OrderList status="issues" />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
