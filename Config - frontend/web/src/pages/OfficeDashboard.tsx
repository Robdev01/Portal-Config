import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, Clock, CheckCircle2, BarChart3, FileText } from "lucide-react";
import { useState } from "react";

type ActivityData = {
  user: string;
  role: string;
  configsCreated: number;
  configsPending: number;
  configsApproved: number;
  lastActivity: string;
};

const OfficeDashboard = () => {
  const [activities] = useState<ActivityData[]>([
    {
      user: "João Silva",
      role: "Técnico",
      configsCreated: 12,
      configsPending: 3,
      configsApproved: 9,
      lastActivity: "2025-01-15T14:30:00",
    },
    {
      user: "Maria Santos",
      role: "Técnico",
      configsCreated: 8,
      configsPending: 1,
      configsApproved: 7,
      lastActivity: "2025-01-15T11:20:00",
    },
    {
      user: "Pedro Costa",
      role: "Coordenação",
      configsCreated: 5,
      configsPending: 0,
      configsApproved: 5,
      lastActivity: "2025-01-14T16:45:00",
    },
  ]);

  const totalStats = {
    totalConfigs: activities.reduce((sum, a) => sum + a.configsCreated, 0),
    totalPending: activities.reduce((sum, a) => sum + a.configsPending, 0),
    totalApproved: activities.reduce((sum, a) => sum + a.configsApproved, 0),
    activeUsers: activities.length,
  };

  const approvalRate = totalStats.totalConfigs > 0 
    ? Math.round((totalStats.totalApproved / totalStats.totalConfigs) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Painel do Escritório</h1>
              <p className="text-sm text-muted-foreground">Acompanhamento e relatórios</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border glow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Configurações</CardTitle>
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStats.totalConfigs}</div>
              <p className="text-xs text-muted-foreground mt-1">Total criadas</p>
            </CardContent>
          </Card>

          <Card className="border-border glow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{totalStats.totalPending}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card className="border-border glow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aprovadas</CardTitle>
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(var(--success))]">{totalStats.totalApproved}</div>
              <p className="text-xs text-muted-foreground mt-1">Taxa: {approvalRate}%</p>
            </CardContent>
          </Card>

          <Card className="border-border glow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
                <Users className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Ativos no sistema</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/coordination-report" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Relatório Detalhado</CardTitle>
                    <CardDescription>Ver relatório completo</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/approved-configs" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[hsl(var(--success))]/10">
                    <CheckCircle2 className="w-6 h-6 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configs Aprovadas</CardTitle>
                    <CardDescription>Visualizar aprovadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/pending-configs" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configs Pendentes</CardTitle>
                    <CardDescription>Acompanhar pendentes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Activity Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Atividade dos Usuários
            </CardTitle>
            <CardDescription>Resumo da atividade recente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{activity.user}</div>
                      <Badge variant="secondary" className="text-xs mt-1">{activity.role}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{activity.configsCreated}</div>
                      <div className="text-muted-foreground text-xs">Criadas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-warning">{activity.configsPending}</div>
                      <div className="text-muted-foreground text-xs">Pendentes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-[hsl(var(--success))]">{activity.configsApproved}</div>
                      <div className="text-muted-foreground text-xs">Aprovadas</div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Última atividade:</div>
                    <div>{new Date(activity.lastActivity).toLocaleDateString('pt-BR')}</div>
                    <div className="text-xs">{new Date(activity.lastActivity).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OfficeDashboard;
