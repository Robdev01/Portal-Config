import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Settings } from "lucide-react";

const CreateConfig = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    cliente: "",
    tipoConfig: "",
    description: "",
    obs: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.cliente || !formData.tipoConfig || !formData.description) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configuração criada com sucesso! ✓",
        description: `${formData.name} foi criada com status "Pendente".`,
      });
      navigate("/pending-configs");
    }, 1000);
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
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Cadastro de Configuração</CardTitle>
                <CardDescription>Criar nova configuração no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id">ID *</Label>
                <Input
                  id="id"
                  placeholder="Ex: CFG-2025-001"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  placeholder="Ex: Empresa XYZ"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoConfig">Tipo da Configuração *</Label>
                <Select
                  value={formData.tipoConfig}
                  onValueChange={(value) => setFormData({ ...formData, tipoConfig: value })}
                  required
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rede">Rede</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                    <SelectItem value="servidor">Servidor</SelectItem>
                    <SelectItem value="aplicacao">Aplicação</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="backup">Backup</SelectItem>
                    <SelectItem value="monitoramento">Monitoramento</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Configuração *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Configuração de Rede Principal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os detalhes da configuração..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="bg-background border-border min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs">Observações</Label>
                <Textarea
                  id="obs"
                  placeholder="Observações adicionais (opcional)..."
                  value={formData.obs}
                  onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                  className="bg-background border-border min-h-[80px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-muted border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Status Inicial:</strong> Pendente
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  A configuração será criada com status "Pendente" e aguardará aprovação da coordenação.
                </p>
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
                  {isLoading ? "Salvando..." : "Salvar Configuração"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateConfig;
