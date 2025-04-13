import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
} from "@clerk/tanstack-react-start";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  if (!request) throw new Error("No request found");
  const { userId,getToken} = await getAuth(request);

  const token = await getToken({ template: 'convex' })

  if (!userId) {
    throw redirect({
      to: "/sign-in/$",
    });
  }

  return { userId,token };
});

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async () => await authStateFn(),
  // loader: async ({ context }) => {
  //   return { userId: context.userId };
  // },
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}));

  const {userId} = useAuth();

  return (
    <div>
      <h1>Welcome! Your ID is {userId}!</h1>


      <div>
      {data.map(({ _id, text }) => (
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
