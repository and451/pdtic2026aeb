import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao fazer login");
        return;
      }
      login(data.user, data.token);
      setLocation("/");
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Target className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg">PDTIC AEB</CardTitle>
          <p className="text-xs text-muted-foreground">Sistema de Gestão MoSCoW, OKR e KPI</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.gov.br"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Senha</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
