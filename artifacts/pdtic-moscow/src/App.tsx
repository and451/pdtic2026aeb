import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Necessidades from "@/pages/necessidades";
import NecessidadeDetail from "@/pages/necessidade-detail";
import Okrs from "@/pages/okrs";
import Kpis from "@/pages/kpis";
import Sobre from "@/pages/sobre";
import Ciclo from "@/pages/ciclo";
import Login from "@/pages/login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

setAuthTokenGetter(() => {
  const stored = localStorage.getItem("pdtic_auth");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed.token ?? null;
  } catch {
    return null;
  }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="h-screen bg-background" />;
  if (!user) {
    setLocation("/login");
    return null;
  }
  return <Component />;
}

function AppRoutes() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (location === "/login") {
    return user ? <Dashboard /> : <Login />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/necessidades" component={Necessidades} />
        <Route path="/necessidades/:id" component={NecessidadeDetail} />
        <Route path="/okrs" component={Okrs} />
        <Route path="/kpis" component={Kpis} />
        <Route path="/sobre" component={Sobre} />
        <Route path="/ciclo" component={Ciclo} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  return <AppRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
