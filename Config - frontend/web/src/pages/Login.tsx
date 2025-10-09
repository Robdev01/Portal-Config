import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import logoConfig from "@/image/vivo_config_sem_fundo.png"

const Login = () => {
  const navigate = useNavigate();
  const [re, setRe] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ re, senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {

        if (resp.status === 401) {
          if (data.message?.includes("Credenciais inválidas")) {
            throw "Senha inválida. Tente novamente.";
          } else {
            throw "Usuário não existe. Favor solicitar ao coordenador para fazer o seu cadastro.";
          }
        }
        if (resp.status === 403

        ) {
          if (data.message?.includes("Credenciais inválidas")) {
            throw "Seu perfil ainda não foi ativado, entre em contato com sua coordenação";
          }
        }

        throw data.message || "Erro inesperado";
      }

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.user.nome}`,
      });
      
      // Salva o usuário no localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redireciona conforme a permissão
      const permissao = data.user.permissao?.toLowerCase();
      
      if (permissao === "escritorio") {
        navigate("/dashboard-admin");
      } else if (permissao === "coordenador") {
        navigate("/dashboard-coordination");
      } else if (permissao === "tecnico") {
        navigate("/dashboard-tecnic");
      } else {
        // Caso não exista tipo válido, vai para uma página padrão
        navigate("/dashboard");
      }
      
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />




      <Card className="w-full max-w-md relative glow-card  border border-border/50 bg-card/50 backdrop-blur-lg shadow-lg">
        <CardHeader className="text-center space-y-2">
          <figure
            className="flex justify-center mb-2 rounded-2xl bg-primary/10 border border-primary/20"
            aria-label="Logotipo da Vivo Capital"
          >
            <img
              src={logoConfig}
              alt="Logotipo da Vivo Capital"
              className="w-52 h-auto object-contain"
              loading="eager"
              decoding="sync"
            />
          </figure>

          <CardTitle
            id="login-title"
            className="text-3xl font-bold tracking-tight"
          >
            Portal de Configuração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="re">RE</Label>
              <Input
                id="re"
                type="text"
                placeholder="Digite seu RE"
                value={re}
                onChange={(e) => setRe(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/register-user"
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
