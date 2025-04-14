import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";


export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async ({context}) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }
  },

});

function Home() {
  const { data } = useQuery(convexQuery(api.tasks.get, {}));

  const {userId} = useAuth();

  return (
    <div>
      <h1>Welcome! Your ID is {userId}!</h1>
      <h1 className="text-5xl font-bold ">
    Hello world!
  </h1>

      <div>
      {data?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>

      <SignedIn>
        <p>You are signed in</p>

        <UserButton />

        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <p>You are signed out</p>

        <SignInButton />

        <SignUpButton />
      </SignedOut>
    </div>
  );
}
