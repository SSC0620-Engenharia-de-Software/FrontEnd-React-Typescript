import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// IMPORTAÇÕES DAS SUAS NOVAS TELAS E COMPONENTES
import { Login } from "../pages/Login";
import { Empresario } from "../pages/Empresario";
import { LayoutFuncionario } from "../components/LayoutFuncionarios";
import { IndicadoresFuncionarios } from "../pages/IndicadoresFuncionarios";
import { BuscasEspecificas } from "../pages/BuscasEspecificas";
import { InserirFuncionarios } from "../pages/InserirFuncionarios";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

{/* temporariamente redirecionando para funcionarios ao abrir o site */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/empresario/:id" element={<Empresario />} />

        {/* SUAS NOVAS ROTAS (PAINEL DE FUNCIONARIOS) */}
        <Route path="/funcionario" element={<LayoutFuncionario />}>
          
          {/* O conteúdo destas sub-rotas vai aparecer dentro do <Outlet /> no LayoutFuncionario */}
          <Route path="indicadores" element={<IndicadoresFuncionarios />} />
          <Route path="busca" element={<BuscasEspecificas />} />
          <Route path="inserir" element={<InserirFuncionarios />} />
          
          {/* Se o usuário acessar apenas "/funcionario", joga ele direto para a aba de indicadores */}
          <Route index element={<Navigate to="indicadores" replace />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}