import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Empresas } from "../pages/Empresas";
import { GraficoReservas, Reservas } from "../pages/Reservas";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Empresas" element={<Empresas />} />
        <Route path="/Reservas" element={<Reservas />} />
        <Route path="/ReservasGrafico" element={<GraficoReservas />} />
      </Routes>
    </BrowserRouter>
  );
}