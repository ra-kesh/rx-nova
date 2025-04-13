/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as SignUpSplatImport } from './routes/sign-up.$'
import { Route as SignInSplatImport } from './routes/sign-in.$'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SignUpSplatRoute = SignUpSplatImport.update({
  id: '/sign-up/$',
  path: '/sign-up/$',
  getParentRoute: () => rootRoute,
} as any)

const SignInSplatRoute = SignInSplatImport.update({
  id: '/sign-in/$',
  path: '/sign-in/$',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/sign-in/$': {
      id: '/sign-in/$'
      path: '/sign-in/$'
      fullPath: '/sign-in/$'
      preLoaderRoute: typeof SignInSplatImport
      parentRoute: typeof rootRoute
    }
    '/sign-up/$': {
      id: '/sign-up/$'
      path: '/sign-up/$'
      fullPath: '/sign-up/$'
      preLoaderRoute: typeof SignUpSplatImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/sign-in/$': typeof SignInSplatRoute
  '/sign-up/$': typeof SignUpSplatRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/sign-in/$': typeof SignInSplatRoute
  '/sign-up/$': typeof SignUpSplatRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/sign-in/$': typeof SignInSplatRoute
  '/sign-up/$': typeof SignUpSplatRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/sign-in/$' | '/sign-up/$'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/sign-in/$' | '/sign-up/$'
  id: '__root__' | '/' | '/sign-in/$' | '/sign-up/$'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SignInSplatRoute: typeof SignInSplatRoute
  SignUpSplatRoute: typeof SignUpSplatRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SignInSplatRoute: SignInSplatRoute,
  SignUpSplatRoute: SignUpSplatRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/sign-in/$",
        "/sign-up/$"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/sign-in/$": {
      "filePath": "sign-in.$.tsx"
    },
    "/sign-up/$": {
      "filePath": "sign-up.$.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
