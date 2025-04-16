import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Package, Pill, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/create")({
  component: CreateProduct,
});

function CreateProduct() {
  const createProduct = useMutation(api.products.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    itemsPerBox: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createProduct({
        ...newProduct,
        pricePerUnit: parseFloat(newProduct.pricePerUnit),
        itemsPerBox: parseInt(newProduct.itemsPerBox),
      });
      setNewProduct({
        name: "",
        description: "",
        pricePerUnit: "",
        itemsPerBox: "",
      });
      toast.success("Product added successfully");
    } catch (err) {
      setError("Failed to create product. Please try again.");
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Paracetamol 500mg"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description, usage, and important information"
                    className="min-h-[100px]"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
                    <div className="relative">
                      <Input
                        id="pricePerUnit"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={newProduct.pricePerUnit}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            pricePerUnit: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemsPerBox">
                      <span className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Items per Box
                      </span>
                    </Label>
                    <Input
                      id="itemsPerBox"
                      type="number"
                      min="1"
                      placeholder="e.g., 30"
                      value={newProduct.itemsPerBox}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          itemsPerBox: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Product..." : "Create Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
