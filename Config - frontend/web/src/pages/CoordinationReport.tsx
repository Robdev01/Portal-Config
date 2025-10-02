import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

type UserActivity = {
  id: string;
  name: string;
  profile: string;
  configsCreated: number;
  configsApproved: number;
  configsRejected: number;
  avgTimeHours: number;
  status: "active" | "inactive";
};

const CoordinationReport = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("current_month");

  const users: UserActivity[] = [
    {
      id: "1",
      name: "João Silva",
      profile: "Técnico",
      configsCreated: 12,
      configsApproved: 10,
      configsRejected: 2,
      avgTimeHours: 4.5,
      status: "active",
    },
    {
      id: "2",
      name: "Maria Santos",
      profile: "Técnico",
      configsCreated: 8,
      configsApproved: 7,
      configsRejected: 1,
      avgTimeHours: 3.2,
      status: "active",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      profile: "Escritório",
      configsCreated: 15,
      configsApproved: 13,
      configsRejected: 2,
      avgTimeHours: 5.8,
      status: "active",
    },
    {
      id: "4",
      name: "Ana Costa",
      profile: "Coordenação",
      configsCreated: 5,
      configsApproved: 5,
      configsRejected: 0,
      avgTimeHours: 2.1,
      status: "active",
    },
    {
      id: "5",
      name: "Pedro Martins",
      profile: "Técnico",
      configsCreated: 3,
      configsApproved: 2,
      configsRejected: 1,
      avgTimeHours: 6.5,
      status: "inactive",
    },
  ];

  const totalConfigs = users.reduce((acc, user) => acc + user.configsCreated, 0);
  const totalApproved = users.reduce((acc, user) => acc + user.configsApproved, 0);
  const totalRejected = users.reduce((acc, user) => acc + user.configsRejected, 0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="glow-card border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Relatório da Coordenação</CardTitle>
                  <CardDescription>Acompanhamento de atividades dos usuários</CardDescription>
                </div>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Mês Atual</SelectItem>
                  <SelectItem value="last_month">Último Mês</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="custom">Período Customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Configs</p>
                  <p className="text-3xl font-bold text-primary">{totalConfigs}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Aprovadas</p>
                  <p className="text-3xl font-bold text-[hsl(var(--success))]">{totalApproved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-[hsl(var(--success))]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reprovadas</p>
                  <p className="text-3xl font-bold text-destructive">{totalRejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Atividade dos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="border-border/50 bg-card/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {user.profile}
                          </Badge>
                          <Badge 
                            className={user.status === "active" 
                              ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" 
                              : "bg-muted text-muted-foreground border-border"
                            }
                          >
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Criadas</p>
                          <p className="font-bold text-lg">{user.configsCreated}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Aprovadas</p>
                          <p className="font-bold text-lg text-[hsl(var(--success))]">{user.configsApproved}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Reprovadas</p>
                          <p className="font-bold text-lg text-destructive">{user.configsRejected}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <p className="text-muted-foreground text-xs">Tempo Médio</p>
                          </div>
                          <p className="font-bold text-lg">{user.avgTimeHours}h</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinationReport;
