import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";

type UserProfile = "tecnico" | "escritorio" | "coordenacao" | "admin_geral";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    re: "",
    password: "",
    confirmPassword: "",
    profile: "" as UserProfile | "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.re || !formData.password || !formData.confirmPassword || !formData.profile) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "As senhas não conferem.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          re: formData.re,
          senha: formData.password,
          permissao: formData.profile,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw data.message || "Erro ao cadastrar usuário.";
      }

      toast({
        title: "Usuário cadastrado com sucesso! ✓",
        description: `${formData.name} foi adicionado como ${formData.profile}.`,
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: typeof err === "string" ? err : "Erro inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="glow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Registro de Usuário</CardTitle>
                <CardDescription>Cadastrar novo usuário no sistema (Admin)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="re">RE *</Label>
                <Input
                  id="re"
                  type="text"
                  placeholder="Digite o RE"
                  value={formData.re}
                  onChange={(e) => setFormData({ ...formData, re: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile">Perfil *</Label>
                <Select
                  value={formData.profile}
                  onValueChange={(value) => setFormData({ ...formData, profile: value as UserProfile })}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o perfil do usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="escritorio">Escritório</SelectItem>
                    <SelectItem value="coordenacao">Coordenação</SelectItem>
                    <SelectItem value="admin_geral">Admin Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Salvando..." : "Cadastrar Usuário"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUser;
