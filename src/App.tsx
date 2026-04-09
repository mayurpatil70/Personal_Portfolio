import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/portfolio/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { getTracker } from "@/lib/tracker";

const queryClient = new QueryClient();

// Inner component to access useLocation hook
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Force refresh/refresh to home page
  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    // Track route changes
    const tracker = getTracker();
    tracker
      .trackPageView(location.pathname)
      .catch((err) => console.warn("Failed to track page view:", err));
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
