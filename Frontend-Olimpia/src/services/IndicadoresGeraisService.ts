import { api } from "../api/axios";

export interface RelatorioNumeroEmpresasDTO {
  mesAnalise: string; 
  quantidadeEmpresas: number; 
}

export interface RelatorioEmpresasFormatado extends RelatorioNumeroEmpresasDTO {
  ano: string;
  mes: string;
  dia: string;
  serie?: string;
}

export const listarRelatorioNumeroEmpresas = async (): Promise<RelatorioEmpresasFormatado[]> => {
  const response = await api.get<RelatorioNumeroEmpresasDTO[]>("/Relatorios/EvolucaoEmpresas");
  
  const dadosFormatados = response.data.map(item => {
    // 2. Garanta que está lendo a propriedade com 'm' minúsculo
    const dataObj = new Date(item.mesAnalise);
    
    return {
      ...item,
      ano: dataObj.getFullYear().toString(),
      mes: String(dataObj.getMonth() + 1).padStart(2, '0'),
      dia: String(dataObj.getDate()).padStart(2, '0')
    };
  });

  return dadosFormatados;
};

export interface RelatorioLeitosDTO {
  mesAnalise: string; 
  totalLeitos: number; 
}

export interface RelatorioLeitosFormatado extends RelatorioLeitosDTO {
  ano: string;
  mes: string;
  dia: string;
  serie?: string;
}

export const listarRelatorioLeitos = async (): Promise<RelatorioLeitosFormatado[]> => {
  // Ajuste a rota se o seu endpoint C# for diferente
  const response = await api.get<RelatorioLeitosDTO[]>("/Relatorios/LeitosPorMes");
  
  const dadosFormatados = response.data.map(item => {
    const dataObj = new Date(item.mesAnalise);
    
    return {
      ...item,
      ano: dataObj.getFullYear().toString(),
      mes: String(dataObj.getMonth() + 1).padStart(2, '0'),
      dia: String(dataObj.getDate()).padStart(2, '0')
    };
  });

  return dadosFormatados;
};

export interface RelatorioDiariaMediaDTO {
  mesAnalise: string; 
  valorDiaria: number; 
}

export interface RelatorioDiariaMediaFormatado extends RelatorioDiariaMediaDTO {
  ano: string;
  mes: string;
  dia: string;
  serie?: string;
}

export const listarRelatorioDiariaMedia = async (): Promise<RelatorioDiariaMediaFormatado[]> => {
  // Ajuste a rota se o seu endpoint C# for diferente
  const response = await api.get<RelatorioDiariaMediaDTO[]>("/Relatorios/DiariaMedia");
  
  const dadosFormatados = response.data.map(item => {
    const dataObj = new Date(item.mesAnalise);
    
    return {
      ...item,
      ano: dataObj.getFullYear().toString(),
      mes: String(dataObj.getMonth() + 1).padStart(2, '0'),
      dia: String(dataObj.getDate()).padStart(2, '0')
    };
  });

  return dadosFormatados;
};