import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Shield, Briefcase, Wrench, Crown } from "lucide-react";

const Profiles = () => {
  const navigate = useNavigate();

  const profiles = [
    {
      name: "Técnico",
      icon: Wrench,
      color: "text-primary",
      bgColor: "bg-primary/10",
      permissions: [
        "Cadastrar configurações próprias",
        "Visualizar próprias configurações",
        "Editar configurações pendentes",
      ],
    },
    {
      name: "Escritório",
      icon: Briefcase,
      color: "text-accent",
      bgColor: "bg-accent/10",
      permissions: [
        "Visualizar relatórios",
        "Acompanhar todas as configurações",
        "Gerar documentações",
      ],
    },
    {
      name: "Coordenação",
      icon: Shield,
      color: "text-[hsl(var(--success))]",
      bgColor: "bg-[hsl(var(--success))]/10",
      permissions: [
        "Aprovar/Reprovar configurações",
        "Visualizar todas as configurações",
        "Acessar relatórios de coordenação",
        "Gerenciar equipe técnica",
      ],
    },
    {
      name: "Admin Geral",
      icon: Crown,
      color: "text-warning",
      bgColor: "bg-[hsl(var(--warning))]/10",
      permissions: [
        "Acesso total ao sistema",
        "Gerenciar todos os usuários",
        "Configurar permissões",
        "Visualizar todos os relatórios",
        "Executar ações administrativas",
      ],
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
              <div className="p-2 rounded-lg bg-muted">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Perfis de Acesso</CardTitle>
                <CardDescription>Gerenciar perfis e suas permissões no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            return (
              <Card key={profile.name} className="border-border hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${profile.bgColor}`}>
                      <Icon className={`w-6 h-6 ${profile.color}`} />
                    </div>
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm font-semibold text-foreground mb-2">
                    Permissões:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.permissions.map((permission, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full ${profile.bgColor} flex-shrink-0`} />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
