import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/Container";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { OrderCard } from "@/components/orders/order-card";
import { OrderStats } from "@/components/orders/order-stats";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useQuery(api.orders.listByUser);

  return (
    <Container className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage all your orders in one place
        </p>
      </div>

      <OrderStats />

      <div className="grid gap-4">
        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}

        {!orders?.length && (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        )}
      </div>
    </Container>
  );
}
