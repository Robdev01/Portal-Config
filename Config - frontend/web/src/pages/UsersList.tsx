import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, XCircle, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  nome: string;
  re: string;
  permissao: string;
  ativo: string;
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPermission, setNewPermission] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const data = await resp.json();
      if (!resp.ok) throw data.message || "Erro ao carregar usuários";
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: typeof err === "string" ? err : "Erro ao buscar usuários",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (re: string) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/ativar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ re }),
      });

      const data = await resp.json();
      if (!resp.ok) throw data.message || "Erro ao ativar usuário";

      toast({ title: "Sucesso", description: `Usuário ${re} foi ativado.` });
      fetchUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: typeof err === "string" ? err : "Erro inesperado",
      });
    }
  };

  const handleDelete = async (re: string) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/usuario/${re}`, {
        method: "DELETE",
      });

      const data = await resp.json();
      if (!resp.ok) throw data.message || "Erro ao excluir usuário";

      toast({ title: "Sucesso", description: `Usuário ${re} excluído.` });
      fetchUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: typeof err === "string" ? err : "Erro inesperado",
      });
    }
  };

  const handlePermissionChange = async () => {
    if (!editingUser) return;

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/permissao`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ re: editingUser.re, permissao: newPermission }),
      });

      const data = await resp.json();
      if (!resp.ok) throw data.message || "Erro ao mudar permissão";

      toast({ title: "Permissão alterada", description: `Usuário atualizado para ${newPermission}.` });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: typeof err === "string" ? err : "Erro inesperado",
      });
    }
  };
  const permissoesMap: Record<string, string> = {
    tecnico: "Técnico",
    escritorio: "Administrativo",
    usuario: "Administrativo",
    coordenador: "Coordenação",
    admin: "Administrador",
  };

  // filtro em tempo real
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.nome.toLowerCase().includes(search.toLowerCase()) ||
            u.re.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>


        <Input
          placeholder="Buscar por nome ou RE"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        {loading ? (
          <p>Carregando...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-border/50">
                <CardContent className="p-0 w-full md:w-auto">
                  <h2 className="text-lg font-semibold">
                    {user.nome} <span className="text-muted-foreground">({user.re})</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {permissoesMap[user.permissao] || user.permissao}
                  </p>

                  <Badge
                    className={`mt-2 ${user.ativo === "sim"
                      ? "bg-primary text-white"
                      : "bg-red-500 text-white"
                      }`}
                  >
                    {user.ativo === "sim" ? "Aprovado" : "Inativo"}
                  </Badge>
                </CardContent>

                <div className="flex gap-3 mt-3 md:mt-0">
                  {user.ativo === "nao" && (
                    <Button size="sm" onClick={() => handleActivate(user.re)}>
                      <UserCheck className="w-4 h-4 mr-1" /> Ativar
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { setEditingUser(user); setNewPermission(user.permissao); }}>
                    <Pencil className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(user.re)}>
                    <XCircle className="w-4 h-4 mr-1" /> Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal para editar permissão */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Permissão</DialogTitle>
            </DialogHeader>
            <Select value={newPermission} onValueChange={(v) => setNewPermission(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione nova permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escritorio">Administrativo</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="coordenacao">Coordenação</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
              <Button onClick={handlePermissionChange}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UsersList;
