import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Container } from "@/components/ui/Container";
import { useLocation } from "@tanstack/react-router";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className }: BaseLayoutProps) {
  const location = useLocation();

  console.log(location.pathname);

  const isAuthRoute =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up");

  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "bg-gradient-to-b from-background to-muted/20",
        className
      )}
    >
      {!isAuthRoute && <Header />}
      <main className="relative flex flex-col min-h-screen">
        <div className="flex-1 py-10">{children}</div>
      </main>
    </div>
  );
}
