import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Container } from "@/components/ui/Container";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "bg-gradient-to-b from-background to-muted/20",
        className
      )}
    >
      <Header />
      <main className="relative flex flex-col min-h-screen">
        <div className="flex-1 py-10">{children}</div>
      </main>
    </div>
  );
}
