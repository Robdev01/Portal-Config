// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Home } from "lucide-react";
import { useState } from "react";
import logoConfig from "@/image/vivo_config_sem_fundo.png"

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* LOGO */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            
            <img
                src={logoConfig}
                alt="Logotipo da Vivo Capital"
                className="w-12 h-12 text-primary"
                loading="eager"
                decoding="sync"
              />
          </div>
          <div>
          <h1 className="text-xl font-bold">Portal de Configuração</h1>
          <p className="text-sm text-muted-foreground">Vivo Capital</p>
          </div>
         
        </div>

        {/* MENU */}
        <nav className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate("/create-config")}>
            Nova Config
          </Button>
          <Button variant="ghost" onClick={() => navigate("/pending-configs")}>
            Pendentes
          </Button>
          <Button variant="ghost" onClick={() => navigate("/approved-configs")}>
            Aprovadas
          </Button>
          <Button variant="ghost" onClick={() => navigate("/coordination-report")}>
            Relatórios
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profiles")}>
            Perfis
          </Button>
          <Button variant="ghost" onClick={() => navigate("/user-list")}>
            Usuários
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
      </div>
    </header>
  );
}
