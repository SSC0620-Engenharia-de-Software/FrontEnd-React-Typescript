import { api } from "../api/axios";

// Interfaces baseadas no que o seu backend espera
export interface LoginRequestDTO {
  id: string; // Pode ser CPF, CNPJ ou E-mail
  senha: string;
}

export interface ResultadoLoginDTO {
  categoria: string; // Ex: 'Visitante', 'Admin', 'Funcionario', 'Empresario'
  idEmpresa: number | null; // Preenchido apenas se for Empresario
}

export const autenticarUsuario = async (dados: LoginRequestDTO): Promise<ResultadoLoginDTO> => {
  // Ajuste a rota '/Login' para coincidir com a sua Controller no C#
  const response = await api.post<ResultadoLoginDTO>("/Login", dados);
  return response.data;
};