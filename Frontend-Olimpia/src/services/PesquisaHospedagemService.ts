import { api } from "../api/axios";

// Adicione ao seu EmpresaService.ts
export interface HistoricoColunaDTO {
  data: string;
  valor: number | null;
}

export const listarHistoricoColuna = async (nomeColuna: string): Promise<Record<number, HistoricoColunaDTO[]>> => {
  // Ajuste a URL conforme o seu Controller
  const response = await api.get<Record<number, HistoricoColunaDTO[]>>(`/DadosPesquisaHospedagem`, {
    params: { coluna: nomeColuna } 
  });
  return response.data;
};