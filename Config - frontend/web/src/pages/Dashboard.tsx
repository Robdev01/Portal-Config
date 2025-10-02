import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Settings, 
  FileCheck, 
  FileClock, 
  BarChart3, 
  Users,
  LogOut,
  ShieldCheck
} from "lucide-react";

const Dashboard = () => {
  const menuItems = [
    {
      title: "Registro de Usuário",
      description: "Cadastrar novos usuários no sistema",
      icon: UserPlus,
      path: "/register-user",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Perfis de Usuários",
      description: "Listagem dos Usuários",
      icon: Users,
      path: "/user-list",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "Cadastro de Configuração",
      description: "Criar nova configuração",
      icon: Settings,
      path: "/create-config",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Configurações Pendentes",
      description: "Visualizar e gerenciar configs pendentes",
      icon: FileClock,
      path: "/pending-configs",
      color: "text-warning",
      bgColor: "bg-[hsl(var(--warning))]/10",
    },
    {
      title: "Configurações Aprovadas",
      description: "Visualizar configurações aprovadas",
      icon: FileCheck,
      path: "/approved-configs",
      color: "text-[hsl(var(--success))]",
      bgColor: "bg-[hsl(var(--success))]/10",
    },
    {
      title: "Relatório da Coordenação",
      description: "Acompanhamento de atividades dos usuários",
      icon: BarChart3,
      path: "/coordination-report",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Perfis de Acesso",
      description: "Gerenciar perfis e permissões",
      icon: Users,
      path: "/profiles",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Portal de Configuração</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gerenciamento</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Bem-vindo ao sistema. Selecione uma opção abaixo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Card className="h-full border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-105 glow-card cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
