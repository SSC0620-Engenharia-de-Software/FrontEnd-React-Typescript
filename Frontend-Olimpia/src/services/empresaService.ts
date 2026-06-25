import { api } from "../api/axios";

export interface EmpresaGeralDTO {
  idEmpresa?: number; // Opcional na criação, obrigatório na atualização
  tipo: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  dataAbertura?: string | null; // Espera formato ISO "YYYY-MM-DD"
  proprietarios?: string;
  cnae?: string;
  cadastur?: string;
  numCadastur?: string;
  vencCadastur?: string | null;
  endereco?: string;
  bairro?: string;
  localizacao?: string;
  regiao?: string;
  telComercial?: string;
  emailComercial?: string;
  site?: string;
  redesSociais?: string;
  funcFixos?: number | null;
  funcTemporarios?: number | null;
}

export interface EmpresaEstruturaDTO {
  qtdUhs?: number | null;
  qtdUhsPcd?: number | null;
  totalLeitos?: number | null;
  minLeitosUh?: number | null;
  maxLeitosUh?: number | null;
  func24h?: boolean | null;
  horarioCheckinCheckout?: string;
  sistemaReservas?: string;
  formasPagamento?: string;
  estacionamento?: boolean | null;
  manobrista?: boolean | null;
  mensageiro?: boolean | null;
  areaFumantes?: boolean | null;
  petFriendly?: boolean | null;
}

export interface EmpresaServicosDTO {
  idiomaIngles?: boolean | null;
  idiomaEspanhol?: boolean | null;
  outroIdioma?: string;
  equipUhs?: string;
  equipRecepcao?: string;
  servicosAeb?: string;
  areaRefeicoes?: boolean | null;
  sanitarioAeb?: boolean | null;
  alimentacaoDiferenciada?: string;
  areaEventos?: boolean | null;
  equipEventos?: string;
  abertoPublico?: boolean | null;
  equipLazer?: string;
}

export interface EmpresaAcessibilidadeDTO {
  facilidadesPcd?: boolean | null;
  tiposDeficiencia?: string;
  pessoalCapacitado?: boolean | null;
  rotaExterna?: boolean | null;
  embarqueDesembarque?: boolean | null;
  vagaEstacionamento?: boolean | null;
  areaCirculacao?: boolean | null;
  escada?: boolean | null;
  rampa?: boolean | null;
  piso?: boolean | null;
  elevador?: boolean | null;
  alarmeEmergencia?: boolean | null;
  locaisAlarme?: string;
  comunicacaoPcd?: string;
  balcaoAtendimento?: boolean | null;
  sanitarioAdaptado?: boolean | null;
  telefoneAcessivel?: boolean | null;
  sinalizacaoPreferencial?: boolean | null;
}

export interface EmpresaPesquisaDTO {
  aceitaPesquisa?: boolean | null;
  telPesquisa?: string;
  emailPesquisa?: string;
  planoEmergencia?: boolean | null;
  mulheresLideranca?: boolean | null;
  mulherEmpreendedora?: boolean | null;
  campEducAmbiental?: boolean | null;
  usoFontesRenovaveis?: boolean | null;
  seloSustentabilidade?: boolean | null;
  campReducaoResiduos?: boolean | null;
  praticasGestaoSustentavel?: boolean | null;
  planoRecursosHidricos?: boolean | null;
  planoGestaoAmbiental?: boolean | null;
}

// Objeto Pai que engloba tudo
export interface EmpresaCompletaDTO {
  dadosGerais: EmpresaGeralDTO;
  estruturaAtual?: EmpresaEstruturaDTO | null;
  servicos?: EmpresaServicosDTO | null;
  acessibilidade?: EmpresaAcessibilidadeDTO | null;
  dadosPesquisa?: EmpresaPesquisaDTO | null;
}


/**
 * Cadastra uma nova empresa completa no banco de dados.
 * @param dados O objeto completo com as abas de cadastro preenchidas
 * @returns O ID gerado para a nova empresa
 */
export const inserirEmpresa = async (dados: EmpresaCompletaDTO): Promise<number> => {
  // ATENÇÃO: Ajuste a rota "/Empresa" caso a sua Controller no C# tenha outro nome (ex: "/Empresas/Inserir")
  const response = await api.post<number>("/CadastrarEmpresa", dados);
  return response.data;
};

/**
 * Atualiza os dados de uma empresa existente.
 * O backend já lida com o versionamento das tabelas de histórico automaticamente.
 * @param dados O objeto completo (dadosGerais.idEmpresa é OBRIGATÓRIO aqui)
 * @returns true se atualizado com sucesso
 */
export const atualizarEmpresa = async (dados: EmpresaCompletaDTO): Promise<boolean> => {
  if (!dados.dadosGerais.idEmpresa) {
    throw new Error("ID da empresa é obrigatório para realizar a atualização.");
  }
  
  // ATENÇÃO: Ajuste a rota "/Empresa" caso necessário (ex: "/Empresas/Atualizar")
  const response = await api.post<boolean>("/AtualizarEmpresa", dados);
  return response.data;
};

/**
 * Busca todos os dados de uma empresa para preencher os formulários de edição.
 * @param idEmpresa ID numérico da empresa a ser buscada
 */
export const pegarEmpresaPorId = async (idEmpresa: number): Promise<EmpresaCompletaDTO> => {
  // ATENÇÃO: Ajuste a rota se necessário
  const response = await api.get<EmpresaCompletaDTO>(`/DadosEmpresa`, {
    params: { id: idEmpresa } 
  });
  return response.data;
};