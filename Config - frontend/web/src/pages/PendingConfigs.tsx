import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileClock, Check, X, User, Calendar, UserPlus, Building2, FileType, StickyNote, Hash } from "lucide-react";

type Config = {
  id: string;
  name: string;
  cliente: string;
  tipoConfig: string;
  description: string;
  obs?: string;
  author: string;
  date: string;
  status: "pending";
  assumedBy?: string;
};

const PendingConfigs = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Config[]>([
    {
      id: "CFG-2025-001",
      name: "Configuração de Firewall",
      cliente: "Empresa ABC Ltda",
      tipoConfig: "seguranca",
      description: "Atualização das regras de firewall para maior segurança",
      obs: "Urgente - prazo até fim do mês",
      author: "João Silva",
      date: "2025-09-28",
      status: "pending",
    },
    {
      id: "CFG-2025-002",
      name: "Configuração de Backup Automático",
      cliente: "Tech Solutions",
      tipoConfig: "backup",
      description: "Implementação de rotina de backup diário às 2h da manhã",
      author: "Maria Santos",
      date: "2025-09-29",
      status: "pending",
      assumedBy: "Carlos Oliveira",
    },
    {
      id: "CFG-2025-003",
      name: "Configuração de VPN",
      cliente: "Digital Corp",
      tipoConfig: "rede",
      description: "Configurar acesso VPN para equipe remota",
      obs: "Necessário teste em ambiente de homologação",
      author: "Pedro Costa",
      date: "2025-09-30",
      status: "pending",
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setConfigs(configs.filter(c => c.id !== id));
    toast({
      title: "Configuração aprovada! ✓",
      description: `"${name}" foi aprovada com sucesso.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setConfigs(configs.filter(c => c.id !== id));
    toast({
      variant: "destructive",
      title: "Configuração reprovada",
      description: `"${name}" foi reprovada.`,
    });
  };

  const handleAssume = (id: string, name: string) => {
    // Simular usuário logado - em produção, pegar do contexto de autenticação
    const currentUser = "Usuário Atual";
    
    setConfigs(configs.map(c => 
      c.id === id ? { ...c, assumedBy: currentUser } : c
    ));
    
    toast({
      title: "Configuração assumida! ✓",
      description: `Você assumiu a responsabilidade por "${name}".`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl py-8">
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(var(--warning))]/10">
                <FileClock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-2xl">Configurações Pendentes</CardTitle>
                <CardDescription>Gerenciar e aprovar configurações aguardando análise</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {configs.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <FileClock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma configuração pendente no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="border-border hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          <Hash className="w-3 h-3 mr-1" />
                          {config.id}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {config.tipoConfig}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{config.name}</CardTitle>
                      <CardDescription className="text-base">{config.description}</CardDescription>
                    </div>
                    <Badge className="bg-warning text-warning-foreground">Pendente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span><strong>Cliente:</strong> {config.cliente}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileType className="w-4 h-4" />
                        <span><strong>Tipo:</strong> {config.tipoConfig}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span><strong>Autor:</strong> {config.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span><strong>Data:</strong> {new Date(config.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    {config.obs && (
                      <div className="flex items-start gap-2 p-3 bg-muted/50 border border-border rounded-md">
                        <StickyNote className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="text-sm">
                          <strong>Obs:</strong> {config.obs}
                        </div>
                      </div>
                    )}
                    {config.assumedBy && (
                      <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                        <UserPlus className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          <strong>Responsável:</strong> {config.assumedBy}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end flex-wrap gap-4 mt-4">
                    <div className="flex gap-2 flex-wrap">
                      {!config.assumedBy && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssume(config.id, config.name)}
                          className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assumir
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(config.id, config.name)}
                        className="border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reprovar
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(config.id, config.name)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingConfigs;
