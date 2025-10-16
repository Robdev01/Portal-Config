import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileClock,
  StickyNote,
  Hash,
  Cog,
  Wrench,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Config = {
  id: number;
  id_config: string;
  cliente: string;
  tipo_config: string;
  observacao?: string;
  nome_responsavel?: string;
  nome_cadastrou?: string;
  status: "pendente" | "em_andamento" | "finalizado" | "cancelado";
  dt_cadastro: string;
  dt_assumiu?: string;
  dt_finalizou?: string;
};

// Cores por status
const getStatusStyles = (status: Config["status"]) => {
  switch (status) {
    case "pendente":
      return { textColor: "text-red-600", iconColor: "text-red-600" };
    case "finalizado":
      return { textColor: "text-green-600", iconColor: "text-green-600" };
    case "cancelado":
      return { textColor: "text-gray-500", iconColor: "text-gray-500" };
    case "em_andamento":
      return { textColor: "text-yellow-600", iconColor: "text-yellow-600" };
    default:
      return { textColor: "text-muted-foreground", iconColor: "text-muted-foreground" };
  }
};

// Formata datas pro fuso BR
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    const offset = 3 * 60;
    const localDate = new Date(date.getTime() + offset * 60 * 1000);
    return localDate.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  } catch (e) {
    console.error("Erro ao formatar data:", e);
    return "—";
  }
};

const DashboardAnalitico = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroMes, setFiltroMes] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados do modal
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(null);
  const [detalheAparelho, setDetalheAparelho] = useState<any | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);

  // Busca lista de aparelhos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos`);
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message || "Erro ao carregar configurações");
        const adjustedConfigs = data.aparelhos.map((item: any) => ({
          id: item.id,
          id_config: item.id_config,
          cliente: item.cliente,
          tipo_config: item.tipo_config,
          observacao: item.observacao,
          nome_responsavel: item.nome_responsavel || item.re_assumiu,
          status: item.status,
          nome_cadastrou:item.nome_cadastrou || item.re_cadastrou,
          dt_cadastro: item.dt_cadastro,
          dt_assumiu: item.dt_assumiu,
          dt_finalizou: item.dt_finalizou,
        }));
        setConfigs(adjustedConfigs);
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
    fetchData();
  }, []);

  // Filtragem
  const filtradas = useMemo(() => {
    let resultado = [...configs];
    if (filtroMes !== "todos") {
      resultado = resultado.filter((c) => {
        const data = new Date(c.dt_cadastro);
        return data.getMonth() + 1 === parseInt(filtroMes);
      });
    }
    if (filtroTipo !== "todos") {
      resultado = resultado.filter((c) => c.tipo_config === filtroTipo);
    }
    if (searchTerm.trim() !== "") {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.cliente.toLowerCase().includes(termo) ||
          c.id_config.toLowerCase().includes(termo)
      );
    }
    resultado.sort((a, b) => {
      if (a.status === "finalizado" && b.status !== "finalizado") return -1;
      if (a.status !== "finalizado" && b.status === "finalizado") return 1;
      return 0;
    });
    return resultado;
  }, [configs, filtroMes, filtroTipo, searchTerm]);

  const total = filtradas.length;
  const manobras = filtradas.filter((c) => c.tipo_config === "Manobra").length;
  const gerais = filtradas.filter((c) => c.tipo_config === "Configuração Geral").length;
  const percent = (valor: number) => (total > 0 ? Math.round((valor / total) * 100) : 0);

  // Busca detalhes ao clicar em visualizar
  const handleVisualizar = async (config: Config) => {
    setSelectedConfig(config);
    setLoadingDetalhe(true);
    setDetalheAparelho(null);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/aparelhos/${config.id}`);
      const data = await resp.json();
      if (resp.ok) setDetalheAparelho(data);
      else
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao buscar detalhes.",
        });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha na comunicação com o servidor.",
      });
    } finally {
      setLoadingDetalhe(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Navegação */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>


        {/* Filtros */}
        <section className="flex flex-wrap gap-3 mb-8">
          <div className="flex-1 min-w-[200px]">
            <Select value={filtroMes} onValueChange={setFiltroMes}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os meses</SelectItem>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="manobra">Manobras</SelectItem>
                <SelectItem value="config_geral">Configurações Gerais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {/* Total */}
          <article className="border-none shadow-sm hover:shadow-md transition rounded-xl p-2 text-center">
            <h2 className="text-lg font-semibold text-blue-700">Total</h2>
            <div className="mx-auto mt-2 w-2/3 max-w-[200px] aspect-square"> {/* 👈 controla o tamanho */}
              <CircularProgressbar
                value={100}
                text={`${total}`}
                styles={buildStyles({
                  textColor: "#1e3a8a",
                  pathColor: "#3b82f6",
                  trailColor: "#dbeafe",
                })}
              />
            </div>
          </article>

          {/* Manobras */}
          <article className="border-none shadow-sm hover:shadow-md transition rounded-xl p-2 text-center">
            <h2 className="text-lg font-semibold text-green-700">Manobras</h2>
            <div className="mx-auto mt-2 w-2/3 max-w-[200px] aspect-square">
              <CircularProgressbar
                value={percent(manobras)}
                text={`${manobras}`}
                styles={buildStyles({
                  textColor: "#15803d",
                  pathColor: "#22c55e",
                  trailColor: "#dcfce7",
                })}
              />
            </div>
          </article>

          {/* Configurações Gerais */}
          <article className="border-none shadow-sm hover:shadow-md transition rounded-xl p-2 text-center">
            <h2 className="text-lg font-semibold text-purple-700">Config. Gerais</h2>
            <div className="mx-auto mt-2 w-2/3 max-w-[200px] aspect-square">
              <CircularProgressbar
                value={percent(gerais)}
                text={`${gerais}`}
                styles={buildStyles({
                  textColor: "#6b21a8",
                  pathColor: "#a855f7",
                  trailColor: "#f3e8ff",
                })}
              />
            </div>
          </article>
        </section>


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

        {/* Lista */}
        {loading ? (
          <p className="text-center text-muted-foreground py-12 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin w-5 h-5" /> Carregando...
          </p>
        ) : filtradas.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <FileClock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma configuração encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <section className="space-y-4">
            {filtradas.map((config) => {
              const { textColor, iconColor } = getStatusStyles(config.status);
              return (
                <Card key={config.id} className="border-border hover:border-primary/40 transition-all bg-muted/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-primary">{config.id_config}</span>
                        </div>
                        <CardTitle className="text-lg mb-1">{config.cliente}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{config.tipo_config}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${textColor}`}>
                        {config.status === "finalizado" ? (
                          <CheckCircle2 className={`w-4 h-4 ${iconColor}`} />
                        ) : (
                          <Loader2 className={`w-4 h-4 ${iconColor}`} />
                        )}
                        <span>{config.status}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <dl className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground mb-2">
                      <div>
                        <dt className="font-semibold">Cadastro:</dt>
                        <dd>{formatDate(config.dt_cadastro)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Cadastrado por:</dt>
                        <dd>{config.nome_cadastrou || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Assumido:</dt>
                        <dd>{formatDate(config.dt_assumiu)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Finalizado:</dt>
                        <dd>{formatDate(config.dt_finalizou)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Assumido por:</dt>
                        <dd>{config.nome_responsavel || "—"}</dd>
                      </div>
                    </dl>



                    {/* Botão visualizar */}
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleVisualizar(config)}>
                        Visualizar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedConfig} onOpenChange={() => setSelectedConfig(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Configuração do ID:  {selectedConfig?.id_config && `${selectedConfig.id_config}`}
            </DialogTitle>
          </DialogHeader>

          {loadingDetalhe ? (
            <div className="flex justify-center items-center py-10 text-muted-foreground">
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Carregando detalhes...
            </div>
          ) : detalheAparelho ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Cliente:</strong> {selectedConfig?.cliente}</p>
              <p><strong>Status:</strong> {selectedConfig?.status}</p>
              <p><strong>Tipo:</strong> {selectedConfig?.tipo_config}</p>
              <p><strong>Quem cadastrou:</strong> {selectedConfig?.nome_cadastrou || "—"}</p>
              <p><strong>Quem assumiu:</strong> {selectedConfig?.nome_responsavel || "—"}</p>
              <p><strong>Cadastro:</strong> {formatDate(selectedConfig?.dt_cadastro)}</p>
              <p><strong>Assumido:</strong> {formatDate(selectedConfig?.dt_assumiu)}</p>
              <p><strong>Finalizado:</strong> {formatDate(selectedConfig?.dt_finalizou)}</p>

              {/* 🔹 Exibe apenas observações (se houver) */}
              {selectedConfig?.observacao && (
                <div className="md:col-span-2 mt-4 border-t pt-3">
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedConfig.observacao}
                  </p>
                </div>
              )}
            </div>

          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum detalhe disponível.</p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default DashboardAnalitico;
