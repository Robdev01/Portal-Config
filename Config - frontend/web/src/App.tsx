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
import UsersList from "./pages/UsersList";
import AppLayout from "./layouts/AppLayout";
import AppLayoutTec from "./layouts/AppLayoutTec";
import AppLayoutAdmin from "./layouts/AppLayoutAdmin";
import AppLayoutCoord from "./layouts/AppLayoutCoord"
import PendingManobras from "./pages/PendingManobras"
import PendingConfigGeral from "./pages/PendingConfigGeral"
import DashboardCoordination from "./pages/DashboardCoordination"
import DashboardAdmin from "./pages/DashboardAdmin"
import DashboardTecnic from "./pages/DashboardTecnic"


import PrivateRoute from "./pages/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login não usa layout */}
          <Route path="/" element={<Login />} />
          <Route path="/register-user" 
          element={<RegisterUser />}
           />

          <Route element={<AppLayoutTec />}>
            <Route
              path="/dashboard-tecnic"
              element={
                <PrivateRoute>
                  <DashboardTecnic />
                </PrivateRoute>
              }
            />
          </Route>

          <Route element={<AppLayoutCoord />}>
          <Route 
            path="/dashboard-coordination" 
            element={
            <PrivateRoute> 
              <DashboardCoordination />
            </PrivateRoute>} /> 
            
          </Route>

          <Route element={<AppLayoutAdmin />}>
          <Route 
            path="/dashboard-admin" 
            element={
            <PrivateRoute> 
              <DashboardAdmin />
            </PrivateRoute>} /> 
            
          </Route>
          
          {/* Páginas com Navbar */}
          <Route element={<AppLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute> 
                  <Dashboard /> 
                </PrivateRoute>} />
            </Route>



            <Route path="/create-config" element={<PrivateRoute> <CreateConfig /></PrivateRoute>} />
            <Route path="/dashboard-admin" element={<PrivateRoute> <DashboardAdmin /></PrivateRoute>} />
            <Route path="/dashboard-coordination" element={<PrivateRoute> <DashboardCoordination /></PrivateRoute>} />
            
            <Route path="/pending-configs" element={<PendingConfigs />} />
            <Route path="/approved-configs" element={<ApprovedConfigs />} />
            <Route path="/coordination-report" element={<CoordinationReport />} />
            <Route path="/profiles" element={<Profiles />} />


            <Route path="/office" element={<OfficeDashboard />} />
            <Route path="/coordination" element={<CoordinationDashboard />} />
            <Route path="/user-list" element={<UsersList />} />
            <Route path="/pending-manobras" element={<PendingManobras />} />
            <Route path="/pending-config-geral" element={<PendingConfigGeral />} />
          

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
