import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type User = {
  id: number;
  nome: string;
  email: string;
  role: string;
  unidade: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("pdtic_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setToken(parsed.token);
          setUser(parsed.user);
        }
      } catch {
        localStorage.removeItem("pdtic_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("pdtic_auth", JSON.stringify({ user: newUser, token: newToken }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pdtic_auth");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
