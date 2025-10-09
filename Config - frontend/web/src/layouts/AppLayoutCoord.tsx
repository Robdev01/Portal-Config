// src/layouts/AppLayout.tsx
import { NavbarCoord } from "@/components/NavbarCoord";
import { Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const location = useLocation();

  // Oculta o navbar nas telas que não precisam (como login)
  const hideNavbar = ["/"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!hideNavbar && <NavbarCoord />}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
