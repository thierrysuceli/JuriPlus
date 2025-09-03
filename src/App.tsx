import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Clientes from "./pages/Clientes";
import Atendimentos from "./pages/Atendimentos";
import Agenda from "./pages/Agenda";
import Configuracoes from "./pages/Configuracoes";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import Advogados from "./pages/Advogados";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="crm" element={<CRM />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="advogados" element={<Advogados />} />
              <Route path="atendimentos" element={<Atendimentos />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
