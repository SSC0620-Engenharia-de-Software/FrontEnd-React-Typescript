import { api } from "../api/axios";

export interface ReservaPromise {
  empresa: string;
  data: string;
  nroReservas: string;
}

export interface Reserva extends ReservaPromise {
  ano: string;
  mes: string;
  dia: string;
}

export const listarReservas = async (): Promise<Reserva[]> => {
  const response = await api.get("/TesteReserva");

  return response.data.map((r: ReservaPromise) => {
    const [ano, mes, dia] = r.data.split("-");

    return {
      ...r,
      ano,
      mes,
      dia,
    };
  });
};