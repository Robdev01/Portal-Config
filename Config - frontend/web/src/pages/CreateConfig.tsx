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
    id_config: "",
    cliente: "",
    tipo_config: "",
    observacao: "",
    cabo: "",
    primaria: "",
    secundaria: "",
    chat_dani_motivo: "",
    dgoi: false,
    cto: false,
    altas: false,
    melhoria_hades: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.id_config || !formData.cliente || !formData.tipo_config) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    // Concatenando as informações do CARIMBO MANOBRA na observação, caso seja "manobra"
    let observacaoFinal = formData.observacao;
    if (formData.tipo_config === "manobra") {
      observacaoFinal += `\n\nCARIMBO MANOBRA:\nID: ${formData.id_config}\nCABO: ${formData.cabo}\nPRIMARIA: ${formData.primaria}\nSECUNDARIA: ${formData.secundaria}\nCHAT DANI MOTIVO: ${formData.chat_dani_motivo}\nDGOI: ${formData.dgoi ? "Sim" : "Não"}\nCTO: ${formData.cto ? "Sim" : "Não"}\nALTAS: ${formData.altas ? "Sim" : "Não"}\nMELHORIA/HADES: ${formData.melhoria_hades ? "Sim" : "Não"}`;
    }

    setIsLoading(true);

    try {
      // ⚙️ Chamada real para o backend Flask
      const response = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_config: formData.id_config,
          cliente: formData.cliente,
          tipo_config: formData.tipo_config,
          observacao: observacaoFinal, // Enviando a observação concatenada
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar configuração.");
      }

      toast({
        title: "Configuração criada com sucesso! ✓",
        description: `${formData.id_config} foi criada com status "Pendente".`,
      });

      navigate("/pending-configs");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configuração",
        description: error.message || "Erro inesperado ao tentar criar configuração.",
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
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
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
                <Label htmlFor="id_config">ID *</Label>
                <Input
                  id="id_config"
                  placeholder="Ex: 000000000"
                  value={formData.id_config}
                  onChange={(e) => setFormData({ ...formData, id_config: e.target.value })}
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
                <Label htmlFor="tipo_config">Tipo da Configuração *</Label>
                <Select
                  value={formData.tipo_config}
                  onValueChange={(value) => setFormData({ ...formData, tipo_config: value })}
                  required
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manobra">Manobra</SelectItem>
                    <SelectItem value="config_geral">Configuração Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exibe os campos adicionais se for "manobra" */}
              {formData.tipo_config === "manobra" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cabo">CABO</Label>
                    <Input
                      id="cabo"
                      value={formData.cabo}
                      onChange={(e) => setFormData({ ...formData, cabo: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaria">PRIMARIA</Label>
                    <Input
                      id="primaria"
                      value={formData.primaria}
                      onChange={(e) => setFormData({ ...formData, primaria: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secundaria">SECUNDARIA</Label>
                    <Input
                      id="secundaria"
                      value={formData.secundaria}
                      onChange={(e) => setFormData({ ...formData, secundaria: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chat_dani_motivo">CHAT DANI MOTIVO</Label>
                    <Textarea
                      id="chat_dani_motivo"
                      value={formData.chat_dani_motivo}
                      onChange={(e) => setFormData({ ...formData, chat_dani_motivo: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <Label>DGOI</Label>
                      <input
                        type="checkbox"
                        checked={formData.dgoi}
                        onChange={() => setFormData({ ...formData, dgoi: !formData.dgoi })}
                        className="bg-background border-border rounded w-5 h-5 mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label>CTO</Label>
                      <input
                        type="checkbox"
                        checked={formData.cto}
                        onChange={() => setFormData({ ...formData, cto: !formData.cto })}
                        className="bg-background border-border rounded w-5 h-5 mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label>ALTAS</Label>
                      <input
                        type="checkbox"
                        checked={formData.altas}
                        onChange={() => setFormData({ ...formData, altas: !formData.altas })}
                        className="bg-background border-border rounded w-5 h-5 mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <Label>MELHORIA/HADES</Label>
                      <input
                        type="checkbox"
                        checked={formData.melhoria_hades}
                        onChange={() => setFormData({ ...formData, melhoria_hades: !formData.melhoria_hades })}
                        className="bg-background border-border rounded w-5 h-5 mt-1"
                      />
                    </div>
                  </div>

                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="observacao">Observações</Label>
                <Textarea
                  id="observacao"
                  placeholder="Observações adicionais (opcional)..."
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  className="bg-background border-border min-h-[80px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-muted border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Status Inicial:</strong> Pendente
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
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
