import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  AlertCircle,
  IndianRupee,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Power } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { Link } from "@tanstack/react-router";
import { ProductColumns } from "@/components/ui/data-table/product-column";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const products = useQuery(api.products.list);
  const updateProduct = useMutation(api.products.update);

  // Mock data - replace with actual queries
  const stats = {
    totalProducts: products?.length || 0,
    pendingOrders: 12,
    activeIssues: 3,
    revenue: 145750,
  };

  
  if (!products) return <div>Loading...</div>;

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy operations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active products in catalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Issues
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeIssues}</div>
              <p className="text-xs text-muted-foreground">
                Reported issues pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.revenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
               <Link to="/admin/create">
               <Button variant="outline" size="sm">
                  Add Product
                </Button></Link>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={products || []}
                  columns={ProductColumns}
                  searchable
                  searchKeys={["name", "description"]}
                  actions={(product) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                       
                        <DropdownMenuItem
                          onClick={() =>
                            updateProduct({
                              id: product._id,
                              name: product.name,
                              description: product.description,
                              pricePerUnit: product.pricePerUnit,
                              itemsPerBox: product.itemsPerBox,
                              isActive: !product.isActive,
                            })
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {product.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Order list implementation */}
                <p className="text-muted-foreground">No orders to display</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Reported Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Issues list implementation */}
                <p className="text-muted-foreground">No issues to display</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
