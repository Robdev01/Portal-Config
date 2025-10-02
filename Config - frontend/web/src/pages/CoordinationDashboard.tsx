import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Clock, User, Calendar, AlertCircle, CheckCircle2, XCircle, Building2, FileType, StickyNote, Hash } from "lucide-react";
import { useState } from "react";

type PendingConfig = {
  id: string;
  name: string;
  cliente: string;
  tipoConfig: string;
  description: string;
  obs?: string;
  author: string;
  date: string;
  priority: "low" | "medium" | "high";
  assumedBy?: string;
};

const CoordinationDashboard = () => {
  const [pendingConfigs, setPendingConfigs] = useState<PendingConfig[]>([
    {
      id: "CFG-2025-007",
      name: "Config Urgente - Sistema Crítico",
      cliente: "Finance Group",
      tipoConfig: "seguranca",
      description: "Correção de falha crítica no sistema de pagamentos",
      obs: "URGENTE - Sistema fora do ar",
      author: "João Silva",
      date: "2025-01-15T09:30:00",
      priority: "high",
      assumedBy: "Maria Santos",
    },
    {
      id: "CFG-2025-008",
      name: "Config Módulo Auth",
      cliente: "Security Plus",
      tipoConfig: "aplicacao",
      description: "Atualização do sistema de autenticação",
      author: "Pedro Costa",
      date: "2025-01-15T11:20:00",
      priority: "medium",
    },
    {
      id: "CFG-2025-009",
      name: "Config Interface Admin",
      cliente: "Admin Solutions",
      tipoConfig: "aplicacao",
      description: "Melhorias na interface do painel administrativo",
      obs: "Baixa prioridade - pode aguardar",
      author: "Ana Lima",
      date: "2025-01-14T16:45:00",
      priority: "low",
      assumedBy: "Pedro Costa",
    },
  ]);

  const stats = {
    total: pendingConfigs.length,
    high: pendingConfigs.filter(c => c.priority === "high").length,
    medium: pendingConfigs.filter(c => c.priority === "medium").length,
    low: pendingConfigs.filter(c => c.priority === "low").length,
    assigned: pendingConfigs.filter(c => c.assumedBy).length,
  };

  const handleApprove = (id: string, name: string) => {
    setPendingConfigs(pendingConfigs.filter(c => c.id !== id));
    toast({
      title: "Configuração aprovada! ✓",
      description: `"${name}" foi aprovada com sucesso.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setPendingConfigs(pendingConfigs.filter(c => c.id !== id));
    toast({
      variant: "destructive",
      title: "Configuração reprovada",
      description: `"${name}" foi reprovada.`,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Alta
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <Clock className="w-3 h-3" />
            Média
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="gap-1">
            Baixa
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

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
              <h1 className="text-2xl font-bold">Painel da Coordenação</h1>
              <p className="text-sm text-muted-foreground">Aprovar e gerenciar configurações</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-destructive">Alta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.high}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-warning">Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.medium}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Baixa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.low}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Atribuídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.assigned}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Configs List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Configurações Pendentes de Aprovação</h2>
            <Link to="/pending-configs">
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Ver Todas Pendentes
              </Button>
            </Link>
          </div>

          {pendingConfigs.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="w-16 h-16 text-[hsl(var(--success))] mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhuma configuração pendente</h3>
                <p className="text-muted-foreground text-center">
                  Todas as configurações foram processadas!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingConfigs.map((config) => (
                <Card key={config.id} className="border-border hover:border-primary/50 transition-all glow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {config.id}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {config.tipoConfig}
                          </Badge>
                          {getPriorityBadge(config.priority)}
                        </div>
                        <CardTitle className="text-lg mb-2">{config.name}</CardTitle>
                        <CardDescription className="text-base">{config.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span><strong>Cliente:</strong> {config.cliente}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileType className="w-4 h-4" />
                          <span><strong>Tipo:</strong> {config.tipoConfig}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span><strong>Autor:</strong> {config.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(config.date).toLocaleDateString('pt-BR')} às{" "}
                          {new Date(config.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {config.obs && (
                        <div className="flex items-start gap-2 p-2 bg-muted/50 border border-border rounded-md">
                          <StickyNote className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">
                            <strong>Obs:</strong> {config.obs}
                          </div>
                        </div>
                      )}
                      {config.assumedBy && (
                        <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            <strong>Responsável:</strong> {config.assumedBy}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-end flex-wrap gap-4 mt-4">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(config.id, config.name)}
                          className="border-[hsl(var(--success))]/50 hover:bg-[hsl(var(--success))] hover:text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(config.id, config.name)}
                          className="border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reprovar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link to="/approved-configs" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[hsl(var(--success))]/10">
                    <CheckCircle2 className="w-6 h-6 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Aprovadas</CardTitle>
                    <CardDescription>Ver configs aprovadas</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/coordination-report" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Relatórios</CardTitle>
                    <CardDescription>Ver atividade dos usuários</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profiles" className="block">
            <Card className="border-border hover:border-primary/50 transition-all glow-card cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Perfis</CardTitle>
                    <CardDescription>Gerenciar permissões</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CoordinationDashboard;
