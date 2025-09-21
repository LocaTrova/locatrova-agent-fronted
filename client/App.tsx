import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ServiceProvider, initializeServices } from "./services/container";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { router } from "./router/routerConfig";

const queryClient = new QueryClient();

// Initialize service container
const serviceContainer = initializeServices();

const App = () => (
  <ErrorBoundary>
    <ServiceProvider container={serviceContainer}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ServiceProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
