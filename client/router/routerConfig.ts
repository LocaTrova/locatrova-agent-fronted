import { createBrowserRouter, RouteObject } from "react-router";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Apps from "../pages/Apps";
import Chat from "../pages/Chat";
import CSSTest from "../pages/CSSTest";

/**
 * Route definitions without JSX
 * Follows Single Responsibility Principle - only handles routing setup
 * Separated from App component for better testability and maintainability
 */
const routes: RouteObject[] = [
  {
    path: "/",
    Component: Index,
  },
  {
    path: "/apps",
    Component: Apps,
  },
  {
    path: "/chat",
    Component: Chat,
  },
  {
    path: "/css-test",
    Component: CSSTest,
  },
  {
    path: "*",
    Component: NotFound,
  },
];

/**
 * Router configuration with future flags
 */
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