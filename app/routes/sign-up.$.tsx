import { Container } from "@/components/ui/Container";
import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up/$")({
  component: Page,
});

function Page() {
  return (
    <Container className="grid place-items-center min-h-svh">
      <SignUp />
    </Container>
  );
}
