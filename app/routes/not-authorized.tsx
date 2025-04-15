import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/not-authorized")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Not Authorized</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
