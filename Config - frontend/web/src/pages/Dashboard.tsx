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
  Columns3, 
} from "lucide-react";


const Dashboard = () => {
  const menuItems = [
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
      title: "Todos Configurações",
      description: "Visualizar e gerenciar configs pendentes",
      icon: Columns3,
      path: "/pending-configs",
      color: "text-warning",
      bgColor: "bg-[hsl(var(--warning))]/10",
    },
    {
      title: "Configurações Pendentes Manobras",
      description: "Visualizar e gerenciar configs pendentes",
      icon: FileClock,
      path: "/pending-manobras",
      color: "text-warning",
      bgColor: "bg-[hsl(var(--warning))]/10",
    },
    {
      title: "Configurações Pendentes Geral",
      description: "Visualizar e gerenciar configs pendentes",
      icon: FileClock,
      path: "/pending-config-geral",
      color: "text-warning",
      bgColor: "bg-[hsl(var(--warning))]/10",
    },
    
   
    {
      title: "Relatório da Coordenação",
      description: "Acompanhamento de atividades dos usuários",
      icon: BarChart3,
      path: "/coordination-report",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  
    
  ];

  return (
    <div className="min-h-screen bg-background">
     
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
