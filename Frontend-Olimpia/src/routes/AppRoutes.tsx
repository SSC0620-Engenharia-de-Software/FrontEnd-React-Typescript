import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Empresas } from "../pages/Empresas";
import { GraficoReservas, Reservas } from "../pages/Reservas";

// IMPORTAÇÕES DAS SUAS NOVAS TELAS E COMPONENTES
import { LayoutFuncionario } from "../components/LayoutFuncionarios";
import { IndicadoresFuncionarios } from "../pages/IndicadoresFuncionarios";
import { BuscaFuncionarios } from "../pages/BuscaFuncionarios";
import { InserirFuncionarios } from "../pages/InserirFuncionarios";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

{/* temporariamente redirecionando para funcionarios ao abrir o site */}
        <Route path="/" element={<Navigate to="/funcionarios/indicadores" replace />} />


        <Route path="/Empresas" element={<Empresas />} />
        <Route path="/Reservas" element={<Reservas />} />
        <Route path="/ReservasGrafico" element={<GraficoReservas />} />

        {/* SUAS NOVAS ROTAS (PAINEL DE FUNCIONARIOS) */}
        <Route path="/funcionarios" element={<LayoutFuncionario />}>
          
          {/* O conteúdo destas sub-rotas vai aparecer dentro do <Outlet /> no LayoutFuncionario */}
          <Route path="indicadores" element={<IndicadoresFuncionarios />} />
          <Route path="busca" element={<BuscaFuncionarios />} />
          <Route path="inserir" element={<InserirFuncionarios />} />
          
          {/* Se o usuário acessar apenas "/funcionarios", joga ele direto para a aba de indicadores */}
          <Route index element={<Navigate to="indicadores" replace />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}