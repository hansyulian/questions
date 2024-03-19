import {
  AnyRoute,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouteComponent,
  RouteOptions,
} from "@tanstack/react-router";
import React from 'react';



function createRoleRoute<TParentRoute extends AnyRoute = AnyRoute>(getParentRoute: () => TParentRoute) {
  const roleRoute = createRoute({
    getParentRoute,
    path: "role",
  });

  const listingRoute = createRoute({
    getParentRoute: () => roleRoute,
    path: "/",
    component: () => <div>Role list</div>,
  });

  const detailsRoute = createRoute({
    getParentRoute: () => roleRoute,
    path: "/$roleId",
    component: () => {
      // because the linting is fixed, this become an issue
      // in their documentation, the "params" should be accessed in the page itself or useStrict: false
      const { roleId } = detailsRoute.useParams();
      return <div >Role ID: {roleId}</div>;
    },
  });

  return roleRoute.addChildren([listingRoute, detailsRoute]);

  // return roleRoute; // this break the linting
}

function createAdminRoute<TParentRoute extends AnyRoute = AnyRoute>(getParentRoute: () => TParentRoute) {
  const adminRoute = createRoute({
    getParentRoute,
    path: "admin",
  });

  return adminRoute.addChildren([
    createRoleRoute(() => adminRoute)
  ]);

  // return adminRoute; // this break the linting
}

const rootRoute = createRootRoute({
  component: Outlet,
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>
    <Link to='/admin/role/$roleId' params={{ roleId: '123' }}>To Role</Link>
    Index
  </div>
})
const adminRoute = createAdminRoute(() => rootRoute);
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => "404 Not Found",
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  // ...flattenRoutes(adminRoute), // adminRoute,
  catchAllRoute,
]);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
