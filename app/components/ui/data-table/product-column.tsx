import { Badge } from "../badge";

export const ProductColumns = [
    {
      header: "Name",
      accessorKey: "name" as const,
      cell: (product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{product.name}</span>
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
    {
      header: "Description",
      accessorKey: "description" as const,
      cell: (product) => (
        <p
          className="text-sm text-muted-foreground max-w-[300px] truncate"
          title={product.description}
        >
          {product.description}
        </p>
      ),
    },
    {
      header: "Price",
      accessorKey: "pricePerUnit" as const,
      cell: (product) => (
        <span className="text-sm">₹{product.pricePerUnit}</span>
      ),
    },
    {
      header: "Box Size",
      accessorKey: "itemsPerBox" as const,
      cell: (product) => (
        <span className="text-sm">{product.itemsPerBox} units</span>
      ),
    },
  ];
