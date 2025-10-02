import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileText, Clock, CheckCircle2, XCircle, Building2, Hash } from "lucide-react";
import { useState } from "react";

type Config = {
  id: string;
  name: string;
  cliente: string;
  tipoConfig: string;
  description: string;
  obs?: string;
  status: "pending" | "approved" | "rejected";
  date: string;
};

const TechnicianDashboard = () => {
  const [configs] = useState<Config[]>([
    {
      id: "CFG-2025-004",
      name: "Config Sistema A",
      cliente: "StartUp Tech",
      tipoConfig: "aplicacao",
      description: "Configuração inicial do módulo de autenticação",
      obs: "Aguardando aprovação",
      status: "pending",
      date: "2025-01-15T10:30:00",
    },
    {
      id: "CFG-2025-005",
      name: "Config Sistema B",
      cliente: "Corp Industries",
      tipoConfig: "servidor",
      description: "Ajustes de performance no backend",
      status: "approved",
      date: "2025-01-10T14:20:00",
    },
    {
      id: "CFG-2025-006",
      name: "Config Sistema C",
      cliente: "Digital Hub",
      tipoConfig: "database",
      description: "Atualização de dependências",
      obs: "Necessário refazer com outras especificações",
      status: "rejected",
      date: "2025-01-08T09:15:00",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "approved":
        return <Badge className="bg-[hsl(var(--success))] text-white">Aprovada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reprovada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const stats = {
    total: configs.length,
    pending: configs.filter(c => c.status === "pending").length,
    approved: configs.filter(c => c.status === "approved").length,
    rejected: configs.filter(c => c.status === "rejected").length,
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
              <h1 className="text-2xl font-bold">Painel do Técnico</h1>
              <p className="text-sm text-muted-foreground">Gerencie suas configurações</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              <CardTitle className="text-sm font-medium text-warning">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[hsl(var(--success))]">Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(var(--success))]">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-destructive">Reprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Link to="/create-config">
            <Button size="lg" className="w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Nova Configuração
            </Button>
          </Link>
        </div>

        {/* Configs List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Minhas Configurações</h2>
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="border-border hover:border-primary/50 transition-all glow-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(config.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {config.id}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {config.tipoConfig}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-1">{config.name}</CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(config.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span><strong>Cliente:</strong> {config.cliente}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Criada em:</strong> {new Date(config.date).toLocaleDateString('pt-BR')} às {new Date(config.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {config.obs && (
                      <div className="text-sm p-2 bg-muted/50 border border-border rounded">
                        <strong>Obs:</strong> {config.obs}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
