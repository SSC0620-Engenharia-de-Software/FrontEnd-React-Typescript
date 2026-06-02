import { api } from "../api/axios";

export interface Empresa {
  nome: string;
  senha: string;
  tipo: string;
}

export const listarEmpresas = async (): Promise<Empresa[]> => {
  const response = await api.get("/TesteEmpresa");
  return response.data;
};