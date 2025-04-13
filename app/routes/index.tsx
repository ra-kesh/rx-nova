import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/tanstack-react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getWebRequest()
  if (!request) throw new Error('No request found')
  const { userId } = await getAuth(request)

  if (!userId) {
   
    throw redirect({
      to: '/sign-in/$',
    })
  }

  return { userId }
})

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
})

function Home() {
  const state = Route.useLoaderData()
  return (
    <div>
      <h1>Welcome! Your ID is {state.userId}!</h1>
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
  )
}