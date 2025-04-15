import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CartPopover } from "@/components/cart/cart-popover";

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const items: NavItem[] = [
    {
      title: "Admin",
      href: "/admin",
      description: "Browse all products",
    },

    {
      title: "Orders",
      href: "/orders",
      description: "View your order history",
    },
    // {
    //   title: "Cart",
    //   href: "/Cart",
    //   description: "View your cart items",
    // },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            "text-muted-foreground hover:text-primary"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
