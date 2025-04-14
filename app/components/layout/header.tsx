import { UserButton } from "@clerk/tanstack-react-start";
import { MainNav } from "./main-nav";
import { Link } from "@tanstack/react-router";
import { Container } from "../ui/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className=" flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">RxNova</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </Container>
    </header>
  );
}
