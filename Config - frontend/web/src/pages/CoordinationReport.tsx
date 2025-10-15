import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, BarChart3, TrendingUp, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ============================
// Tipagens
// ============================
type Config = {
  id: number;
  id_config: string;
  cliente: string;
  tipo_config: string;
  observacao?: string;
  nome_responsavel?: string;
  status: string;
  dt_cadastro: string;
  dt_assumiu?: string;
  dt_finalizou?: string;
};

type ResumoPerfil = {
  re: string;
  tecnico: string;
  total_assumidas: number;
  total_finalizadas: number;
  tempo_medio_minutos: number | null;
};

type TarefaTecnico = {
  id_config: string;
  cliente: string;
  tipo_config: string;
  status: string;
  tempo_minutos: number | null;
};


// ============================
// Componente Principal
// ============================
const CoordinationReport = () => {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState<Config[]>([]);
  const [resumoPerfis, setResumoPerfis] = useState<ResumoPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("current_month");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [tarefas, setTarefas] = useState<TarefaTecnico[]>([]);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState<string>("");
  const [loadingTarefas, setLoadingTarefas] = useState(false);

  // ==========================
  // 1. Buscar configurações
  // ==========================
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos?period=${period}`);
        const data = await resp.json();

        if (!resp.ok) throw new Error(data.message || "Erro ao carregar configurações.");

        const parsed = data.aparelhos.map((item: any): Config => ({
          id: item.id,
          id_config: item.id_config,
          cliente: item.cliente,
          tipo_config: item.tipo_config,
          observacao: item.observacao,
          nome_responsavel: item.nome_responsavel || item.re_assumiu,
          status: item.status,
          dt_cadastro: item.dt_cadastro,
          dt_assumiu: item.dt_assumiu,
          dt_finalizou: item.dt_finalizou,
        }));

        setConfigs(parsed);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar configurações",
          description: err.message || "Erro inesperado.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [period]);

  // ==========================
  // 2. Buscar resumo por perfil
  // ==========================
  useEffect(() => {
    const fetchResumoPerfis = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/resumo_perfil?period=${period}`);
        const data = await resp.json();
        if (resp.ok && data.resumo) {
          setResumoPerfis(data.resumo);
        } else {
          setResumoPerfis([]);
        }
      } catch (err) {
        console.error("Erro ao carregar resumo de perfis:", err);
      }
    };
    fetchResumoPerfis();
  }, [period]);

  // ==========================
  // 3. Abrir Modal com Tarefas
  // ==========================
  const abrirModal = async (re: string, tecnicoNome: string) => {
    setTecnicoSelecionado(tecnicoNome);
    setModalOpen(true);
    setLoadingTarefas(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/resumo_perfil/${re}/tarefas`);
      const data = await resp.json();
      if (resp.ok && data.tarefas) {
        setTarefas(data.tarefas);
      } else {
        setTarefas([]);
      }
    } catch (err) {
      console.error("Erro ao carregar tarefas do técnico:", err);
    } finally {
      setLoadingTarefas(false);
    }
  };


  // ==========================
  // 4. Filtragem e Totais
  // ==========================
  const filtradas = useMemo(() => {
    let resultado = [...configs];
    if (searchTerm.trim() !== "") {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.cliente?.toLowerCase().includes(termo) ||
          c.id_config?.toLowerCase().includes(termo) ||
          c.tipo_config?.toLowerCase().includes(termo)
      );
    }
    return resultado.sort(
      (a, b) => new Date(b.dt_cadastro).getTime() - new Date(a.dt_cadastro).getTime()
    );
  }, [configs, searchTerm]);

  const total = filtradas.length;
  const manobras = filtradas.filter((c) =>
    c.tipo_config?.toLowerCase().includes("manobra")
  ).length;
  const gerais = filtradas.filter((c) =>
    c.tipo_config?.toLowerCase().includes("geral")
  ).length;


  function formatarTempo(minutos: number) {
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    if (horas > 0) return `${horas}h ${mins}min`;
    return `${mins}min`;
  }
  
  // ==========================
  // 5. Renderização
  // ==========================
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl py-8">
        {/* Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Cabeçalho */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Relatório de Configurações</CardTitle>
                  <CardDescription>Monitoramento geral de manobras e configurações</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  placeholder="Buscar cliente, ID ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px]"
                />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_month">Mês Atual</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                    <SelectItem value="all">Todos os Dados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3b82f6] mb-1">Total</p>
                  <p className="text-4xl font-bold text-[#3b82f6]">{total}</p>
                </div>
                <TrendingUp className="w-9 h-9 text-[#3b82f6]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#22c55e] mb-1">Manobras</p>
                  <p className="text-4xl font-bold text-[#22c55e]">{manobras}</p>
                </div>
                <CheckCircle className="w-9 h-9 text-[#22c55e]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#a855f7] mb-1">Config. Gerais</p>
                  <p className="text-4xl font-bold text-[#a855f7]">{gerais}</p>
                </div>
                <XCircle className="w-9 h-9 text-[#a855f7]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking de Técnicos */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle>Ranking de Técnicos</CardTitle>
            <CardDescription>
              Total de tarefas assumidas, finalizadas e tempo médio de execução
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-6">Carregando dados...</p>
            ) : resumoPerfis.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Nenhum registro encontrado para este período.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-border/50 text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3">Técnico</th>
                      <th className="py-2 px-3 text-center">Assumidas</th>
                      <th className="py-2 px-3 text-center">Finalizadas</th>
                      <th className="py-2 px-3 text-center">Tempo Médio (h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumoPerfis.map((r) => (
                      <tr
                        key={r.re}
                        className="border-b border-border/20 hover:bg-muted/5 cursor-pointer"
                        onClick={() => abrirModal(r.re, r.tecnico)}
                      >
                        <td className="py-2 px-3 font-medium text-primary hover:underline">{r.tecnico}</td>
                        <td className="py-2 px-3 text-center">{r.total_assumidas}</td>
                        <td className="py-2 px-3 text-center text-green-500 font-semibold">
                          {r.total_finalizadas}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {r.tempo_medio_minutos !== null
                            ? formatarTempo(r.tempo_medio_minutos)
                            : "—"}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal Detalhes do Técnico */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Técnico: {tecnicoSelecionado}</DialogTitle>
            </DialogHeader>

            {loadingTarefas ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : tarefas.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Nenhuma tarefa encontrada para este técnico.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-border/50 text-muted-foreground">
                    <tr>
                      <th className="py-2 px-3">ID Config</th>
                      <th className="py-2 px-3">Cliente</th>
                      <th className="py-2 px-3">Tipo</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-center">Tempo (h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarefas.map((t) => (
                      <tr key={t.id_config} className="border-b border-border/20 hover:bg-muted/5">
                        <td className="py-2 px-3 font-medium">{t.id_config}</td>
                        <td className="py-2 px-3">{t.cliente}</td>
                        <td className="py-2 px-3">{t.tipo_config}</td>
                        <td className="py-2 px-3 capitalize">{t.status}</td>
                        <td className="py-2 px-3 text-center">
                          {t.tempo_minutos !== null ? formatarTempo(t.tempo_minutos) : "—"}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CoordinationReport;
