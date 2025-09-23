import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopNavLayout } from "./components/TopNavLayout";
import Dashboard from "./pages/Dashboard";
import TempleManagement from "./pages/TempleManagement";
import QueueControl from "./pages/QueueControl";
import Analytics from "./pages/Analytics";
import Facilities from "./pages/Facilities";
import Emergency from "./pages/Emergency";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <TopNavLayout>
              <Dashboard />
            </TopNavLayout>
          } />
          <Route path="/temple" element={
            <TopNavLayout>
              <TempleManagement />
            </TopNavLayout>
          } />
          <Route path="/queue" element={
            <TopNavLayout>
              <QueueControl />
            </TopNavLayout>
          } />
          <Route path="/analytics" element={
            <TopNavLayout>
              <Analytics />
            </TopNavLayout>
          } />
          <Route path="/facilities" element={
            <TopNavLayout>
              <Facilities />
            </TopNavLayout>
          } />
          <Route path="/emergency" element={
            <TopNavLayout>
              <Emergency />
            </TopNavLayout>
          } />
          <Route path="/reports" element={
            <TopNavLayout>
              <Reports />
            </TopNavLayout>
          } />
          <Route path="/settings" element={
            <TopNavLayout>
              <div className="p-8 text-center">
                <h1 className="font-teko text-3xl font-bold text-primary mb-4">Settings & Configuration</h1>
                <p className="text-muted-foreground">Temple configuration coming soon...</p>
              </div>
            </TopNavLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
