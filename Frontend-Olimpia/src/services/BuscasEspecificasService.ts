import { api } from "../api/axios";

export interface TipoEmpresaDTO {
  idTipo: number;
  nomeTipo: string;
}

export interface RelatorioNumeroEmpresasDTO {
  mesAnalise: string; 
  quantidadeEmpresas: number; 
}

export interface RelatorioLeitosDTO {
  mesAnalise: string;
  totalLeitos: number;
}

export interface RelatorioDiariaMediaDTO {
  mesAnalise: string;
  valorDiaria: number;
}

// Interface base para o mapeamento de datas comuns a todos os relatórios
interface DadosFormatadosData {
  ano: string;
  mes: string;
  dia: string;
  serie?: string;
}

export interface RelatorioEmpresasFormatado extends RelatorioNumeroEmpresasDTO, DadosFormatadosData {}
export interface RelatorioLeitosFormatado extends RelatorioLeitosDTO, DadosFormatadosData {}
export interface RelatorioDiariaMediaFormatado extends RelatorioDiariaMediaDTO, DadosFormatadosData {}


const formatarHistorico = <T extends { mesAnalise: string }>(dados: T[]): (T & DadosFormatadosData)[] => {
  return dados.map(item => {
    const dataObj = new Date(item.mesAnalise);
    return {
      ...item,
      ano: dataObj.getFullYear().toString(),
      mes: String(dataObj.getMonth() + 1).padStart(2, '0'),
      dia: String(dataObj.getDate()).padStart(2, '0')
    };
  });
};

/**
 * Busca todas as categorias/tipos de hospedagem cadastradas
 */
export const listarTiposEmpresa = async (): Promise<TipoEmpresaDTO[]> => {
  const response = await api.get<TipoEmpresaDTO[]>("/TiposEmpresa");
  return response.data;
};

/**
 * Busca a evolução do número de empresas.
 * @param nomeTipo Opcional. Se fornecido, filtra pelo nome do tipo de estabelecimento.
 */
export const listarRelatorioNumeroEmpresas = async (nomeTipo?: string): Promise<RelatorioEmpresasFormatado[]> => {
  const response = await api.get<RelatorioNumeroEmpresasDTO[]>("/Relatorios/EvolucaoEmpresas", {
    // A chave 'tipo' deve ter o mesmo nome do parâmetro esperado na sua Controller C#
    params: { tipoEmpresa: nomeTipo } 
  });
  return formatarHistorico(response.data);
};

/**
 * Busca a evolução do total de leitos.
 * @param nomeTipo Opcional. Se fornecido, filtra pelo nome do tipo de estabelecimento.
 */
export const listarRelatorioLeitos = async (nomeTipo?: string): Promise<RelatorioLeitosFormatado[]> => {
  const response = await api.get<RelatorioLeitosDTO[]>("/Relatorios/LeitosPorMes", {
    params: { tipoEmpresa: nomeTipo }
  });
  return formatarHistorico(response.data);
};

/**
 * Busca a evolução do valor médio das diárias.
 * @param nomeTipo Opcional. Se fornecido, filtra pelo nome do tipo de estabelecimento.
 */
export const listarRelatorioDiariaMedia = async (nomeTipo?: string): Promise<RelatorioDiariaMediaFormatado[]> => {
  const response = await api.get<RelatorioDiariaMediaDTO[]>("/Relatorios/DiariaMedia", {
    params: { tipoEmpresa: nomeTipo }
  });
  return formatarHistorico(response.data);
};