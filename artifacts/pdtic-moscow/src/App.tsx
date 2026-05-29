import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Necessidades from "@/pages/necessidades";
import NecessidadeDetail from "@/pages/necessidade-detail";
import Okrs from "@/pages/okrs";
import Kpis from "@/pages/kpis";
import Sobre from "@/pages/sobre";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/necessidades" component={Necessidades} />
        <Route path="/necessidades/:id" component={NecessidadeDetail} />
        <Route path="/okrs" component={Okrs} />
        <Route path="/kpis" component={Kpis} />
        <Route path="/sobre" component={Sobre} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
