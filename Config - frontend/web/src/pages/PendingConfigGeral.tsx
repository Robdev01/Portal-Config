import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Cog,
  FileClock,
  UserPlus,
  StickyNote,
  Hash,
  Edit3,
  Search,
  Check
} from "lucide-react";

type Config = {
  id: string;
  id_config: string;
  cliente: string;
  tipo_config: string;
  observacao?: string;
  re_assumiu?: string;
  re_cadastrou?: string;
  nome_cadastrou?: string;
  nome_responsavel?: string;
  status: string;
  dt_cadastro: string;
  dt_assumiu?: string;
  dt_finalizou?: string;
  _removing?: boolean;
};

const PendingConfigGeral = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [editCliente, setEditCliente] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // 🔹 Carrega configurações do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos/pendentes/config_geral`);
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || "Erro ao carregar configurações gerais");
        setConfigs(data.aparelhos);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar configurações gerais",
          description: err.message || "Erro inesperado.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função ajustada para formatar datas no fuso horário do Brasil (-03:00)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      // Cria um objeto Date a partir da string GMT
      const date = new Date(dateStr);
      // Ajusta para o fuso horário do Brasil (-03:00) manualmente
      const offset = 3 * 60; // -3 horas em minutos
      const localDate = new Date(date.getTime() + offset * 60 * 1000);
      return localDate.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo", // Força o fuso horário do Brasil
      });
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return "—"; // Retorna "—" em caso de erro
    }
  };
  // 🔹 Assume uma configuração
  const handleAssume = async (id: string) => {
    try {
      const usuarioRaw = localStorage.getItem("user");
      const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
      const re = usuario?.re || null;

      if (!re) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível identificar o usuário logado.",
        });
        return;
      }

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos/assumir/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ re_assumiu: re }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Erro ao assumir configuração.");

      setConfigs((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, re_assumiu: re, status: "em_andamento", dt_assumiu: new Date().toISOString() } : c
        )
      );

      toast({
        title: "Configuração assumida ✓",
        description: `Você assumiu a configuração ${id}.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao assumir",
        description: err.message || "Erro inesperado.",
      });
    }
  };

  // 🔹 Abre modal de edição
  const openEditModal = (config: Config) => {
    setEditingConfig(config);
    setEditCliente(config.cliente);
    setEditTipo(config.tipo_config);
    setEditStatus(config.status);
  };

  // 🔹 Salva alterações
  const handleSaveEdit = async () => {
    if (!editingConfig) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos/${editingConfig.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: editCliente,
          tipo_config: editTipo,
          status: editStatus,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Erro ao atualizar configuração.");

      setConfigs((prev) =>
        prev.map((c) =>
          c.id === editingConfig.id
            ? { ...c, cliente: editCliente, tipo_config: editTipo, status: editStatus }
            : c
        )
      );

      toast({ title: "Configuração atualizada ✓", description: "Alterações salvas com sucesso." });
      setEditingConfig(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: err.message || "Erro inesperado.",
      });
    }
  };

  // 🔹 Marca como feito com animação
  const handleMarkAsDone = async (id: string) => {
    const configToFinalize = configs.find((config) => config.id === id);
    if (configToFinalize && !configToFinalize.re_assumiu) {
      toast({
        variant: "destructive",
        title: "Erro ao finalizar",
        description: "Esta configuração precisa ser assumida antes de ser finalizada.",
      });
      return; // Não permite concluir a tarefa se não tiver sido assumida
    }
    try {
      const now = new Date().toISOString();

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos/finalizar/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dt_finalizou: now }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Erro ao finalizar configuração.");

      setConfigs((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "finalizado", dt_finalizou: now, _removing: true } : c
        )
      );

      setTimeout(() => {
        setConfigs((prev) => prev.filter((c) => c.id !== id));
      }, 500);

      toast({
        title: "Configuração finalizada ✓",
        description: `A configuração foi marcada como concluída.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao finalizar",
        description: err.message || "Erro inesperado.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-5xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>


        <Card className="glow-card border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cog className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold">Configurações Gerais Pendentes</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Campo de busca */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Pesquisar por cliente ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conteúdo principal */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : configs.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <FileClock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma configuração geral pendente no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {configs
              .filter(
                (config) =>
                  config.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  config.id_config.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((config) => {
                const statusColor =
                  config.status === "pendente"
                    ? "text-red-500"
                    : config.status === "em_andamento"
                      ? "text-purple-500"
                      : config.status === "finalizado"
                        ? "text-green-500"
                        : "text-muted-foreground";

                const dotColor =
                  config.status === "pendente"
                    ? "bg-red-500"
                    : config.status === "em_andamento"
                      ? "bg-purple-500"
                      : config.status === "finalizado"
                        ? "bg-green-500"
                        : "bg-gray-400";

                return (
                  <Card
                    key={config.id}
                    className={`border border-border rounded-xl shadow-sm transition-all duration-200 ${config._removing
                      ? "opacity-50 scale-[0.98] pointer-events-none"
                      : "hover:shadow-md hover:border-primary/50"
                      }`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div className="flex-1">
                        {/* Identificadores */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-0.5 border-primary text-primary"
                          >
                            {config.id_config}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {config.tipo_config}
                          </Badge>
                        </div>

                        {/* Título e status */}
                        <CardTitle className="text-lg md:text-xl font-semibold text-foreground mb-1">
                          {config.cliente}
                        </CardTitle>

                        <p className="text-sm text-muted-foreground">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${config.status === "finalizado"
                              ? "text-green-600"
                              : config.status === "em_andamento"
                                ? "text-yellow-600"
                                : config.status === "pendente"
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                          >
                            {config.status.charAt(0).toUpperCase() +
                              config.status.slice(1).replace("_", " ")}
                          </span>
                          {config.re_assumiu && (
                            <>
                              {" | "}
                              <strong>Assumido por:</strong>{" "}
                              {config.nome_responsavel || config.re_assumiu}
                            </>
                          )}

                        </p>
                      </div>

                      {/* Bolinha indicativa de status */}
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ml-3 ${config.status === "finalizado"
                          ? "bg-green-500"
                          : config.status === "em_andamento"
                            ? "bg-yellow-400"
                            : config.status === "pendente"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                      />
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Datas */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 text-xs text-muted-foreground gap-2">
                        <div>
                          <strong>Cadastro:</strong> {formatDate(config.dt_cadastro)}
                        </div>
                        <div>
                          <strong>Cadastrado por:</strong>{" "}
                          {config.nome_cadastrou || config.re_cadastrou || "—"}
                        </div>
                        <div>
                          <strong>Assumido:</strong> {formatDate(config.dt_assumiu)}
                        </div>
                        <div>
                          <strong>Finalizado:</strong> {formatDate(config.dt_finalizou)}
                        </div>
                      </div>

                      {/* Observações */}
                      {config.observacao && (
                        <div className="flex items-start gap-2 p-2 bg-muted/30 border border-border rounded-md text-xs leading-snug">
                          <p className="whitespace-pre-line">
                            <strong>Observação: </strong>
                          </p>
                          <p className="whitespace-pre-line">{config.observacao}</p>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex justify-end flex-wrap gap-2 pt-2">
                        {!config.re_assumiu && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssume(config.id)}
                            className="border-primary/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assumir
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(config)}
                          className="border-blue-400/50 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Editar
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleMarkAsDone(config.id)}
                          className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Concluir
                        </Button>
                      </div>
                    </CardContent>

                  </Card>
                );
              })}
          </div>
        )}
      </div>

      {/* Modal de edição */}
      <Dialog open={!!editingConfig} onOpenChange={() => setEditingConfig(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Configuração</DialogTitle>
          </DialogHeader>

          {editingConfig && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID da Configuração
                </label>
                <Input value={editingConfig.id_config} disabled className="bg-muted/40 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                <Input
                  value={editingConfig.nome_responsavel || editingConfig.re_assumiu || "—"}
                  disabled
                  className="bg-muted/40 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                  <Input value={formatDate(editingConfig.dt_cadastro)} disabled className="bg-muted/40 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status Atual</label>
                  <Input value={editingConfig.status} disabled className="bg-muted/40 cursor-not-allowed" />
                </div>
              </div>

              <hr className="my-4 border-border" />

              <div>
                <label className="text-sm font-medium">Cliente</label>
                <Input value={editCliente} onChange={(e) => setEditCliente(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo da Configuração</label>
                <Select value={editTipo} onValueChange={setEditTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manobra">Manobra</SelectItem>
                    <SelectItem value="config_geral">Configuração Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingConfig(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingConfigGeral;
