import { useEffect, useState } from "react";
import { type Reserva, listarReservas } from "../services/reservaService";
import { GraficoColunas, GraficoScatter } from "../components/graficosGenericos";

function PegarReservas(){
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    listarReservas().then(setReservas);
  }, []);

  return reservas;
}

export function Reservas() {
  const reservas = PegarReservas();

  return (
    <div>
      <h1>Reservas por mês</h1>

      <ul>
        {reservas.map((e) => (
          <li key={`${e.empresa}-${e.data}`}>
            {e.empresa} {e.data}: {e.nroReservas}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GraficoReservas() {
  const reservas = PegarReservas();

  return (
    <>
      <GraficoColunas
        dados={reservas}
        chavesX={["ano"]}
        chavesSerie={["empresa"]}
        chaveValor="nroReservas"
        nomeEixoX="Ano"
        nomeEixoY="Nro de Reservas"
        tamanhoFonteX="24"
      />
      <GraficoColunas
        dados={reservas}
        chavesX={["ano", "mes"]}
        chavesSerie={["empresa"]}
        chaveValor="nroReservas"
        nomeEixoX="Ano - Mês"
        nomeEixoY="Nro de Reservas"
        tamanhoFonteX="22"
      />
      <GraficoColunas
        dados={reservas}
        chavesX={["ano", "mes", "dia"]}
        chavesSerie={["empresa"]}
        chaveValor="nroReservas"
      />
      <GraficoScatter
        dados={reservas}
        chavesX={["ano", "mes", "dia"]}
        chavesSerie={["empresa"]}
        chaveValor="nroReservas"
      />
      <GraficoColunas
        dados={reservas}
        chavesX={["mes"]}
        chavesSerie={["empresa"]}
        chaveValor="nroReservas"
        nomeEixoX="Mês"
        nomeEixoY="Nro de Reservas"
        tamanhoFonteX="24"
      />
    </>
  );
}