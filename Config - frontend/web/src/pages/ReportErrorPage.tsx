import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const ReportErrorPage = () => {
  const [usuario, setUsuario] = useState("");
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assunto || !descricao) {
      toast({ variant: "destructive", title: "Erro", description: "Preencha assunto e descrição" });
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/reportar_erro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, assunto, descricao }),
      });
      const data = await resp.json();
      if (resp.ok) {
        toast({ title: "Sucesso", description: data.message });
        setUsuario("");
        setAssunto("");
        setDescricao("");
      } else {
        toast({ variant: "destructive", title: "Erro", description: data.message || "Falha no envio" });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message || "Erro inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">Reportar Erro / Suporte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Seu usuário (opcional)"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          placeholder="Assunto *"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
        <Textarea
          placeholder="Descreva o erro ou suporte *"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={6}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Relatório"}
        </Button>
      </form>
    </div>
  );
};

export default ReportErrorPage;
