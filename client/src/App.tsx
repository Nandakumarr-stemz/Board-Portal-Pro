import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Meetings from "@/pages/meetings";
import Documents from "@/pages/documents";
import Members from "@/pages/members";
import ActionItems from "@/pages/action-items";
import Settings from "@/pages/settings";
import MeetingDetail from "@/pages/meeting-detail";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/meetings" element={<Meetings />} />
      <Route path="/meetings/:id" element={<MeetingDetail />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/members" element={<Members />} />
      <Route path="/action-items" element={<ActionItems />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const style = {
    "--sidebar-width": "17rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <HashRouter>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />

                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400" />

                  <header className="flex items-center justify-between gap-4 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ThemeToggle />
                  </header>

                  <main className="flex-1 overflow-auto">
                    <AppRouter />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </HashRouter>

          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
