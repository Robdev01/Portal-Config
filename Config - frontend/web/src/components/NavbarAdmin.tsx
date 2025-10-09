// src/components/NavbarCoord.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import logoConfig from "@/image/vivo_config_sem_fundo.png";

export function NavbarAdmin() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LOGO */}
        <div
          onClick={() => handleNavigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <img
              src={logoConfig}
              alt="Logotipo da Vivo Capital"
              className="w-10 h-10 object-contain"
              loading="eager"
              decoding="sync"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight">
              Portal de Configuração
            </h1>
            <p className="text-xs text-muted-foreground">Vivo Capital</p>
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={() => handleNavigate("/dashboard-admin")}>
            Início
          </Button>
          <Button variant="ghost" onClick={() => handleNavigate("/create-config")}>
            Nova Config
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-muted-foreground">
              {user?.nome || "Usuário"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive/80"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-muted transition"
          aria-label="Abrir menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background shadow-sm">
          <nav className="flex flex-col p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigate("/dashboard")}
            >
              Início
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigate("/create-config")}
            >
              Nova Config
            </Button>          

            <div className="border-t border-border/30 pt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {user?.nome || "Usuário"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive/80"
              >
                <LogOut className="w-4 h-4 mr-1" /> Sair
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
