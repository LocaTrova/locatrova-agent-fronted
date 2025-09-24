import { createBrowserRouter, RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    lazy: () =>
      import("../pages/Index").then((m) => ({ Component: m.default })),
  },
  {
    path: "/apps",
    lazy: () => import("../pages/Apps").then((m) => ({ Component: m.default })),
  },
  {
    path: "/chat",
    lazy: () => import("../pages/Chat").then((m) => ({ Component: m.default })),
  },
  {
    path: "/location/:id",
    lazy: () =>
      import("../pages/Location").then((m) => ({ Component: m.default })),
  },
  {
    path: "/location/:id/:identifier",
    lazy: () =>
      import("../pages/Location").then((m) => ({ Component: m.default })),
  },
  {
    path: "/css-test",
    lazy: () =>
      import("../pages/CSSTest").then((m) => ({ Component: m.default })),
  },
  {
    path: "*",
    lazy: () =>
      import("../pages/NotFound").then((m) => ({ Component: m.default })),
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    // Temporarily disabled v7_startTransition to fix infinite loop with Switch component
    // v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
