import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileCheck, User, Calendar, Building2, FileType, StickyNote, Hash } from "lucide-react";

type Config = {
  id: string;
  name: string;
  cliente: string;
  tipoConfig: string;
  description: string;
  obs?: string;
  author: string;
  date: string;
  approvedDate: string;
  status: "approved";
};

const ApprovedConfigs = () => {
  const navigate = useNavigate();
  const configs: Config[] = [
    {
      id: "CFG-2024-098",
      name: "Configuração de VPN Corporativa",
      cliente: "Global Systems",
      tipoConfig: "rede",
      description: "Configuração completa da VPN para acesso remoto seguro",
      obs: "Configuração testada e validada",
      author: "Ana Costa",
      date: "2025-09-25",
      approvedDate: "2025-09-26",
      status: "approved",
    },
    {
      id: "CFG-2024-099",
      name: "Configuração de Monitoramento",
      cliente: "Tech Innovation",
      tipoConfig: "monitoramento",
      description: "Sistema de monitoramento de servidores e aplicações",
      author: "Pedro Martins",
      date: "2025-09-20",
      approvedDate: "2025-09-22",
      status: "approved",
    },
    {
      id: "CFG-2024-100",
      name: "Configuração de Email Corporativo",
      cliente: "Business Solutions",
      tipoConfig: "aplicacao",
      description: "Configuração de servidores de email e políticas de segurança",
      obs: "Implementado com sucesso",
      author: "Lucas Ferreira",
      date: "2025-09-15",
      approvedDate: "2025-09-16",
      status: "approved",
    },
  ];

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
              <div className="p-2 rounded-lg bg-[hsl(var(--success))]/10">
                <FileCheck className="w-6 h-6 text-[hsl(var(--success))]" />
              </div>
              <div>
                <CardTitle className="text-2xl">Configurações Aprovadas</CardTitle>
                <CardDescription>Visualizar configurações aprovadas (apenas leitura)</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {configs.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma configuração aprovada ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="border-border hover:border-[hsl(var(--success))]/30 transition-all">
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
                        <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20">
                          <FileCheck className="w-3 h-3 mr-1" />
                          Aprovada
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{config.name}</CardTitle>
                      <CardDescription className="text-base">{config.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
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
                        <span><strong>Criada:</strong> {new Date(config.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileCheck className="w-4 h-4" />
                        <span><strong>Aprovada:</strong> {new Date(config.approvedDate).toLocaleDateString('pt-BR')}</span>
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

export default ApprovedConfigs;
