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
import CoordinationReport from "./pages/CoordinationReport";
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
import ReportErrorPage from "./pages/ReportErrorPage";


import PrivateRoute from "./pages/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ========== ROTAS PÚBLICAS ========== */}
          <Route path="/" element={<Login />} />
          <Route path="/register-user" element={<RegisterUser />} />

          {/* ========== LAYOUT: TÉCNICO ========== */}
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

          {/* ========== LAYOUT: COORDENAÇÃO ========== */}
          <Route element={<AppLayoutCoord />}>
            <Route
              path="/dashboard-coordination"
              element={
                <PrivateRoute>
                  <DashboardCoordination />
                </PrivateRoute>
              }
            />
          </Route>

          {/* ========== LAYOUT: ADMIN ========== */}
          <Route element={<AppLayoutAdmin />}>
            <Route
              path="/dashboard-admin"
              element={
                <PrivateRoute>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
          </Route>

          {/* ========== LAYOUT: PADRÃO (NAVBAR ETC) ========== */}
          <Route element={<AppLayout />}>
            {/* Painéis principais */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-config"
              element={
                <PrivateRoute>
                  <CreateConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending-configs"
              element={
                <PrivateRoute>
                  <PendingConfigs />
                </PrivateRoute>
              }
            />
            <Route
              path="/coordination-report"
              element={
                <PrivateRoute>
                  <CoordinationReport />
                </PrivateRoute>
              }
            />

            {/* Seções de controle */}
            <Route
              path="/office"
              element={
                <PrivateRoute>
                  <OfficeDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/coordination"
              element={
                <PrivateRoute>
                  <CoordinationDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-list"
              element={
                <PrivateRoute>
                  <UsersList />
                </PrivateRoute>
              }
            />

            {/* Pendências */}
            <Route
              path="/pending-manobras"
              element={
                <PrivateRoute>
                  <PendingManobras />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending-config-geral"
              element={
                <PrivateRoute>
                  <PendingConfigGeral />
                </PrivateRoute>
              }
            />

            {/* Reportar erro / suporte */}
            <Route
              path="/report-error"
              element={
                <PrivateRoute>
                  <ReportErrorPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* ========== PÁGINA 404 ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
