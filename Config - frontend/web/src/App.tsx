import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterUser from "./pages/RegisterUser";
import CreateConfig from "./pages/CreateConfig";
import PendingConfigs from "./pages/PendingConfigs";
import ApprovedConfigs from "./pages/ApprovedConfigs";
import CoordinationReport from "./pages/CoordinationReport";
import Profiles from "./pages/Profiles";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import OfficeDashboard from "./pages/OfficeDashboard";
import CoordinationDashboard from "./pages/CoordinationDashboard";
import NotFound from "./pages/NotFound";
import UsersList from "./pages/UsersList"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/create-config" element={<CreateConfig />} />
          <Route path="/pending-configs" element={<PendingConfigs />} />
          <Route path="/approved-configs" element={<ApprovedConfigs />} />
          <Route path="/coordination-report" element={<CoordinationReport />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/technician" element={<TechnicianDashboard />} />
          <Route path="/office" element={<OfficeDashboard />} />
          <Route path="/coordination" element={<CoordinationDashboard />} />
          <Route path="/user-list" element={<UsersList />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
