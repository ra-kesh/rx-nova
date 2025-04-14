// app/routes/__root.tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router'
import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start'
import { QueryClient } from '@tanstack/react-query'
import { ConvexReactClient } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { createServerFn } from '@tanstack/react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { getWebRequest } from '@tanstack/react-start/server'

import appCss from "@/styles/app.css?url"

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const auth = await getAuth(getWebRequest() as Request)
  const token = await auth.getToken({ template: 'convex' })

  return {
    userId: auth.userId,
    token,
  }
})


export const Route = createRootRouteWithContext<{
  queryClient:QueryClient;
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),beforeLoad: async (ctx) => {
    const auth = await fetchClerkAuth()
    const { userId, token } = auth

    // During SSR only (the only time serverHttpClient exists),
    // set the Clerk auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return {
      userId,
      token,
    }
  },
  // errorComponent: (props) => {
  //   return (
  //     <RootDocument>
  //       <DefaultCatchBoundary {...props} />
  //     </RootDocument>
  //   )
  // },
  // notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={context.convexClient} useAuth={useAuth}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
     <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}