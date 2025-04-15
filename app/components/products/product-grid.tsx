import { Id } from "convex/_generated/dataModel"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Array<{
    id: Id<"products">,
    name: string
    description: string
    unitPrice: number
    boxPrice: number
    itemsPerBox: number
    image?: string
  }>
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}