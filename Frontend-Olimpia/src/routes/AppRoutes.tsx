import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Empresas } from "../pages/Empresas";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Empresas />} />
      </Routes>
    </BrowserRouter>
  );
}