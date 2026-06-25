import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  type EmpresaCompletaDTO, 
  pegarEmpresaPorId, 
  atualizarEmpresa, 
  inserirEmpresa 
} from '../services/EmpresaService'; // <- Ajuste o caminho
import { 
  type TipoEmpresaDTO, 
  listarTiposEmpresa 
} from '../services/BuscasEspecificasService'; // <- Novo import adicionado
import './Empresario.css';

type FormDataRecord = Record<string, any>;

const defaultValues: FormDataRecord = {
  aceita_pesquisa: '0', ods3_plano: '0', ods5_lideranca: '0', ods5_empreend: '0',
  ods6_campanha: '0', ods7_energia: '0', ods12_selo: '0', ods12_residuos: '0',
  ods12_gestao: '0', ods14_hidrico: '0', ods11_plano: '0', func_24h: '0',
  estacionamento: '0', manobrista: '0', mensageiro: '0', fumantes: '0',
  pet: '0', idioma_ingles: '0', idioma_espanhol: '0', ab_area_refeicoes: '0',
  ab_sanitario: '0', ab_alim_dif: '0', eventos_possui: '0', ev_aberto_publico: '0',
  acess_possui: '0', pcd_pessoal: '0', alarme: '0', sig_pcd: '0'
};

const toRadio = (val?: boolean | null | string): string => val === true || val === '1' ? '1' : (val === false || val === '0' ? '0' : '');
const toBool = (val?: string | boolean | null): boolean | null => val === '1' || val === true ? true : (val === '0' || val === false ? false : null);
const joinKeys = (data: FormDataRecord, keys: string[]) => keys.filter(k => data[k]).join(',');

export function Empresario() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>('gerais');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicializa como true para esperar as requisições iniciais
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataRecord>(defaultValues);
  
  // Novo State para o Dropdown dinâmico
  const [tiposEmpresa, setTiposEmpresa] = useState<TipoEmpresaDTO[]>([]);
  
  const originalData = useRef<FormDataRecord>(defaultValues);

  // 1. CARREGAR DADOS DO SERVIDOR
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setIsLoading(true);
      try {
        // Busca os tipos de empresa para o dropdown paralelamente ou antes dos dados do formulário
        const tipos = await listarTiposEmpresa();
        setTiposEmpresa(tipos);

        if (id && id.toLowerCase() !== 'novo') {
          const empresaDto = await pegarEmpresaPorId(Number(id));
          const dadosMapeados = mapDtoToForm(empresaDto);
          setFormData(dadosMapeados);
          originalData.current = { ...dadosMapeados };
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Não foi possível carregar as informações do servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [id]);

  // 2. FUNÇÃO: Mapear os dados do DTO para o formato do State/Inputs HTML
  const mapDtoToForm = (dto: EmpresaCompletaDTO): FormDataRecord => {
    const form = { ...defaultValues };
    const dg = dto.dadosGerais || {} as any;
    const de = dto.estruturaAtual || {} as any;
    const ds = dto.servicos || {} as any;
    const da = dto.acessibilidade || {} as any;
    const dp = dto.dadosPesquisa || {} as any;

    let fb = '', ig = '';
    try {
      if (dg.redesSociais) {
        const parsed = JSON.parse(dg.redesSociais);
        fb = parsed.fb || ''; ig = parsed.ig || '';
      }
    } catch (e) { }

    form.tipo = dg.tipo || '';
    form.razao_social = dg.razaoSocial || '';
    form.nome_fantasia = dg.nomeFantasia || '';
    form.data_abertura = dg.dataAbertura ? dg.dataAbertura.split('T')[0] : '';
    form.proprietario = dg.proprietarios || '';
    form.cnae = dg.cnae || '';
    form.cadastur_status = dg.cadastur || '';
    form.numero_cadastur = dg.numCadastur || '';
    form.vencimento_cadastur = dg.vencCadastur ? dg.vencCadastur.split('T')[0] : '';
    form.endereco = dg.endereco || '';
    form.bairro = dg.bairro || '';
    form.localizacao = dg.localizacao || '';
    form.regiao = dg.regiao || '';
    form.telefone_comercial = dg.telComercial || '';
    form.email_comercial = dg.emailComercial || '';
    form.site = dg.site || '';
    form.facebook = fb;
    form.instagram = ig;
    form.func_fixos = dg.funcFixos || '';
    form.func_temp = dg.funcTemporarios || '';

    form.aceita_pesquisa = toRadio(dp.aceitaPesquisa);
    form.telefone_pesquisa = dp.telPesquisa || '';
    form.email_pesquisa = dp.emailPesquisa || '';
    form.ods3_plano = toRadio(dp.planoEmergencia);
    form.ods5_lideranca = toRadio(dp.mulheresLideranca);
    form.ods5_empreend = toRadio(dp.mulherEmpreendedora);
    form.ods6_campanha = toRadio(dp.campEducAmbiental);
    form.ods7_energia = toRadio(dp.usoFontesRenovaveis);
    form.ods12_selo = toRadio(dp.seloSustentabilidade);
    form.ods12_residuos = toRadio(dp.campReducaoResiduos);
    form.ods12_gestao = toRadio(dp.praticasGestaoSustentavel);
    form.ods14_hidrico = toRadio(dp.planoRecursosHidricos);
    form.ods11_plano = toRadio(dp.planoGestaoAmbiental);

    form.uhs = de.qtdUhs || '';
    form.uhs_pcd = de.qtdUhsPcd || '';
    form.leitos = de.totalLeitos || '';
    form.leitos_min = de.minLeitosUh || '';
    form.leitos_max = de.maxLeitosUh || '';
    form.func_24h = toRadio(de.func24h);
    form.checkin_checkout = de.horarioCheckinCheckout || '';
    form.estacionamento = toRadio(de.estacionamento);
    form.manobrista = toRadio(de.manobrista);
    form.mensageiro = toRadio(de.mensageiro);
    form.fumantes = toRadio(de.areaFumantes);
    form.pet = toRadio(de.petFriendly);

    form.idioma_ingles = toRadio(ds.idiomaIngles);
    form.idioma_espanhol = toRadio(ds.idiomaEspanhol);
    form.idioma_outro = ds.outroIdioma || '';
    form.ab_area_refeicoes = toRadio(ds.areaRefeicoes);
    form.ab_sanitario = toRadio(ds.sanitarioAeb);
    form.ab_alim_dif = ds.alimentacaoDiferenciada;
    form.eventos_possui = toRadio(ds.areaEventos);
    form.ev_aberto_publico = toRadio(ds.abertoPublico);
    form.acess_possui = toRadio(da.facilidadesPcd);
    form.pcd_pessoal = toRadio(da.pessoalCapacitado);
    form.alarme = toRadio(da.alarmeEmergencia);
    form.sig_pcd = toRadio(da.sinalizacaoPreferencial);

    const applyCheckboxes = (str: string | undefined | null) => {
      if (!str) return;
      str.split(',').forEach(key => { if (key.trim()) form[key.trim()] = true; });
    };

    applyCheckboxes(de.sistemaReservas);
    applyCheckboxes(de.formasPagamento);
    applyCheckboxes(ds.equipUhs);
    applyCheckboxes(ds.equipRecepcao);
    applyCheckboxes(ds.servicosAeb);
    applyCheckboxes(ds.equipEventos);
    applyCheckboxes(ds.equipLazer);
    applyCheckboxes(da.tiposDeficiencia);
    applyCheckboxes(da.locaisAlarme);
    applyCheckboxes(da.comunicacaoPcd);

    form.rota_calcada = da.rotaExterna;
    form.emb_sinalizado = da.embarqueDesembarque;
    form.vaga_sinalizada = da.vagaEstacionamento;
    form.circ_circulacao = da.areaCirculacao;
    form.esc_corrimao = da.escada;
    form.rmp_corrimao = da.rampa;
    form.piso_regular = da.piso;
    form.elev_braille = da.elevador;
    form.san_barra = da.sanitarioAdaptado;
    form.tel_altura = da.telefoneAcessivel;
    form.balcao_rebaixado = da.balcaoAtendimento;

    return form;
  };

  // 3. FUNÇÃO: Mapear do Form State para a DTO do C# (Ao Salvar)
  const mapFormToDto = (): EmpresaCompletaDTO => {
    return {
      dadosGerais: {
        idEmpresa: id && id.toLowerCase() !== 'novo' ? Number(id) : undefined,
        tipo: formData.tipo,
        razaoSocial: formData.razao_social,
        nomeFantasia: formData.nome_fantasia,
        dataAbertura: formData.data_abertura || null,
        proprietarios: formData.proprietario,
        cnae: formData.cnae,
        cadastur: formData.cadastur_status,
        numCadastur: formData.numero_cadastur,
        vencCadastur: formData.vencimento_cadastur || null,
        endereco: formData.endereco,
        bairro: formData.bairro,
        localizacao: formData.localizacao,
        regiao: formData.regiao,
        telComercial: formData.telefone_comercial,
        emailComercial: formData.email_comercial,
        site: formData.site,
        redesSociais: JSON.stringify({ fb: formData.facebook, ig: formData.instagram }),
        funcFixos: Number(formData.func_fixos) || null,
        funcTemporarios: Number(formData.func_temp) || null,
      },
      dadosPesquisa: {
        aceitaPesquisa: toBool(formData.aceita_pesquisa),
        telPesquisa: formData.telefone_pesquisa,
        emailPesquisa: formData.email_pesquisa,
        planoEmergencia: toBool(formData.ods3_plano),
        mulheresLideranca: toBool(formData.ods5_lideranca),
        mulherEmpreendedora: toBool(formData.ods5_empreend),
        campEducAmbiental: toBool(formData.ods6_campanha),
        usoFontesRenovaveis: toBool(formData.ods7_energia),
        seloSustentabilidade: toBool(formData.ods12_selo),
        campReducaoResiduos: toBool(formData.ods12_residuos),
        praticasGestaoSustentavel: toBool(formData.ods12_gestao),
        planoRecursosHidricos: toBool(formData.ods14_hidrico),
        planoGestaoAmbiental: toBool(formData.ods11_plano),
      },
      estruturaAtual: {
        qtdUhs: Number(formData.uhs) || null,
        qtdUhsPcd: Number(formData.uhs_pcd) || null,
        totalLeitos: Number(formData.leitos) || null,
        minLeitosUh: Number(formData.leitos_min) || null,
        maxLeitosUh: Number(formData.leitos_max) || null,
        func24h: toBool(formData.func_24h),
        horarioCheckinCheckout: formData.checkin_checkout,
        estacionamento: toBool(formData.estacionamento),
        manobrista: toBool(formData.manobrista),
        mensageiro: toBool(formData.mensageiro),
        areaFumantes: toBool(formData.fumantes),
        petFriendly: toBool(formData.pet),
        sistemaReservas: joinKeys(formData, ['reserva_direto', 'reserva_online', 'reserva_agencia', 'reserva_telefone']),
        formasPagamento: joinKeys(formData, ['pgto_dinheiro', 'pgto_cartao_debito', 'pgto_cartao_credito', 'pgto_pix', 'pgto_boleto'])
      },
      servicos: {
        idiomaIngles: toBool(formData.idioma_ingles),
        idiomaEspanhol: toBool(formData.idioma_espanhol),
        outroIdioma: formData.idioma_outro,
        areaRefeicoes: toBool(formData.ab_area_refeicoes),
        sanitarioAeb: toBool(formData.ab_sanitario),
        alimentacaoDiferenciada: formData.ab_alim_dif,
        areaEventos: toBool(formData.eventos_possui),
        abertoPublico: toBool(formData.ev_aberto_publico),
        equipUhs: joinKeys(formData, ['uh_wifi', 'uh_arcond', 'uh_ventilador', 'uh_frigobar', 'uh_tv']),
        equipRecepcao: joinKeys(formData, ['rec_wifi', 'rec_arcond', 'rec_ventilador', 'rec_estar', 'rec_sanitario', 'rec_sanitario_pcd']),
        servicosAeb: joinKeys(formData, ['ab_cafe', 'ab_meia_pensao', 'ab_pensao_completa', 'ab_all_inclusive', 'ab_room_service', 'ab_restaurante', 'ab_lanchonete', 'ab_bar', 'ab_bar_molhado', 'ab_copa_bebe']),
        equipEventos: joinKeys(formData, ['ev_arcond', 'ev_ventilador', 'ev_sanitario', 'ev_sanitario_pcd', 'ev_mobiliario', 'ev_audiovisual']),
        equipLazer: joinKeys(formData, ['lz_piscina', 'lz_piscina_inf', 'lz_sauna', 'lz_spa', 'lz_area_verde', 'lz_descanso', 'lz_academia', 'lz_quadra', 'lz_salao_jogos', 'lz_lazer_criancas', 'lz_recreacao_criancas', 'lz_anfiteatro', 'lz_minigolf', 'lz_futebol', 'lz_sanitario', 'lz_sanitario_pcd'])
      },
      acessibilidade: {
        facilidadesPcd: toBool(formData.acess_possui),
        pessoalCapacitado: toBool(formData.pcd_pessoal),
        alarmeEmergencia: toBool(formData.alarme),
        sinalizacaoPreferencial: toBool(formData.sig_pcd),
        tiposDeficiencia: joinKeys(formData, ['pcd_fisica', 'pcd_auditiva', 'pcd_visual', 'pcd_intelectual', 'pcd_multipla']),
        locaisAlarme: joinKeys(formData, ['alarme_entrada', 'alarme_recepcao', 'alarme_sanitario', 'alarme_eventos', 'alarme_restaurante', 'alarme_lazer', 'alarme_resgate']),
        comunicacaoPcd: joinKeys(formData, ['com_braille', 'com_fonte_amp', 'com_libras']),
        
        rotaExterna: !!(formData.rota_calcada || formData.rota_faixa || formData.rota_rampa || formData.rota_semaforo || formData.rota_piso_tatil || formData.rota_piso_antid || formData.rota_sem_obst || formData.rota_nivel),
        embarqueDesembarque: !!(formData.emb_sinalizado || formData.emb_nivel || formData.emb_sem_obst),
        vagaEstacionamento: !!(formData.vaga_sinalizada || formData.vaga_nivel || formData.vaga_alargada || formData.vaga_rampa),
        areaCirculacao: !!(formData.circ_plataforma || formData.circ_circulacao || formData.circ_porta_larga),
        escada: !!(formData.esc_corrimao || formData.esc_patamar || formData.esc_piso_tatil || formData.esc_sig_visual || formData.esc_piso_antid),
        rampa: !!(formData.rmp_corrimao || formData.rmp_patamar || formData.rmp_piso_antid || formData.rmp_sig_tatil || formData.rmp_inclinacao),
        piso: !!(formData.piso_tatil || formData.piso_regular || formData.piso_antid),
        elevador: !!(formData.elev_braille || formData.elev_sonoro || formData.elev_luminoso || formData.elev_sensor || formData.elev_visual),
        balcaoAtendimento: !!(formData.balcao_rebaixado || formData.balcao_preferencial),
        sanitarioAdaptado: !!(formData.san_barra || formData.san_porta_larga || formData.san_giro || formData.san_pia || formData.san_espelho || formData.san_box || formData.san_torneira || formData.san_piso || formData.san_piso_tatil),
        telefoneAcessivel: !!(formData.tel_altura || formData.tel_surdos)
      }
    };
  };

  // 4. ATUALIZAR / SALVAR COM FORM EVENT
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o recarregamento da página pelo form HTML
    
    try {
      setIsSaving(true);
      const dtoParaEnviar = mapFormToDto();
      
      if (id && id.toLowerCase() !== 'novo') {
        await atualizarEmpresa(dtoParaEnviar);
        alert("Dados salvos com sucesso!");
      } else {
        const novoId = await inserirEmpresa(dtoParaEnviar);
        alert("Empresa cadastrada com sucesso!");
        navigate(`/empresario/${novoId}`); 
      }
      
      originalData.current = { ...formData };
      setIsDirty(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Houve um erro ao tentar salvar os dados. Verifique a conexão ou os dados preenchidos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    if (!isDirty) return;
    if (window.confirm('Descartar todas as alterações não salvas?')) {
      setFormData({ ...originalData.current });
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Nunito' }}>Carregando dados da empresa...</div>;
  }

  return (
    // Transformamos a div container em form e passamos o evento onSubmit para o handleSave
    <form className="empresario-page-container" onSubmit={handleSave}>
      
      {/* TOP BANNER */}
      <div style={{ background: 'var(--white)', paddingTop: 0 }}>
        <div className="top-banner">Página do empresário</div>
      </div>

      {/* HEADER */}
      <div className="page-header">
        <div className="header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="hotel-name">{formData.nome_fantasia || formData.razao_social || 'Nova Empresa'}</h1>
            <span className={`unsaved-badge ${isDirty ? 'visible' : ''}`}>
              Alterações não salvas
            </span>
          </div>
          <div className="header-actions">
            {/* Trocamos type="button" para type="submit" para engatilhar as validações HTML nativas (required) */}
            <button type="submit" className="btn-action save" disabled={isSaving} title="Salvar">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-action cancel" onClick={handleCancel} disabled={isSaving} title="Cancelar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Cancelar
            </button>
          </div>
        </div>

        {/* TABS NAV */}
        <nav className="tabs-nav" role="tablist">
          {[
            { id: 'gerais', label: 'Informações Gerais' },
            { id: 'pesquisa', label: 'Pesquisa' },
            { id: 'estrutura', label: 'Estrutura' },
            { id: 'servicos', label: 'Serviços e Equipamentos' },
            { id: 'acessibilidade', label: 'Acessibilidade' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button" // Previne envio de form ao clicar na aba
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* CONTENT */}
      <div className="content">
        
        {/* ABA: INFORMAÇÕES GERAIS */}
        <div className={`tab-panel ${activeTab === 'gerais' ? 'active' : ''}`}>
          <div className="section-card">
            <div className="section-title-bar">Dados Cadastrais</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={9}>Identificação</td>
                  <td className="td-label">Tipo de estabelecimento</td>
                  <td className="td-value">
                    <select name="tipo" value={formData.tipo || ''} onChange={handleInputChange} required>
                      <option value="">— Selecione —</option>
                      {/* Dropdown alimentado de forma dinâmica pela nova função */}
                      {tiposEmpresa.map((t) => (
                        <option key={t.idTipo} value={t.nomeTipo}>{t.nomeTipo}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Razão Social</td>
                  <td className="td-value">
                    <input type="text" name="razao_social" value={formData.razao_social || ''} onChange={handleInputChange} placeholder="—" required />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Nome Fantasia</td>
                  <td className="td-value">
                    <input type="text" name="nome_fantasia" value={formData.nome_fantasia || ''} onChange={handleInputChange} placeholder="—" />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Data de Abertura</td>
                  <td className="td-value">
                    <input type="date" name="data_abertura" value={formData.data_abertura || ''} onChange={handleInputChange} required />
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Proprietário(s)</td>
                  <td className="td-value"><input type="text" name="proprietario" value={formData.proprietario || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">CNAE</td>
                  <td className="td-value"><input type="text" name="cnae" value={formData.cnae || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">CADASTUR</td>
                  <td className="td-value">
                    <select name="cadastur_status" value={formData.cadastur_status || ''} onChange={handleInputChange}>
                      <option value="">—</option>
                      <option value="1">Sim</option>
                      <option value="0">Não</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Número do CADASTUR</td>
                  <td className="td-value"><input type="text" name="numero_cadastur" value={formData.numero_cadastur || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Vencimento do CADASTUR</td>
                  <td className="td-value"><input type="date" name="vencimento_cadastur" value={formData.vencimento_cadastur || ''} onChange={handleInputChange} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Localização e Contato</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={8}>Endereço e Contato</td>
                  <td className="td-label">Endereço</td>
                  <td className="td-value"><input type="text" name="endereco" value={formData.endereco || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Bairro</td>
                  <td className="td-value"><input type="text" name="bairro" value={formData.bairro || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Localização</td>
                  <td className="td-value">
                    <select name="localizacao" value={formData.localizacao || ''} onChange={handleInputChange}>
                      <option value="">—</option>
                      <option value="Urbana">Urbana</option>
                      <option value="Rural">Rural</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Região</td>
                  <td className="td-value"><input type="text" name="regiao" value={formData.regiao || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Telefone Comercial</td>
                  <td className="td-value"><input type="tel" name="telefone_comercial" value={formData.telefone_comercial || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">E-mail Comercial</td>
                  <td className="td-value"><input type="email" name="email_comercial" value={formData.email_comercial || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Site</td>
                  <td className="td-value"><input type="text" name="site" value={formData.site || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">Redes Sociais (Facebook / Instagram)</td>
                  <td className="td-value">
                    <input type="text" name="facebook" value={formData.facebook || ''} onChange={handleInputChange} placeholder="Facebook" style={{ maxWidth: '150px', marginBottom: '4px', display: 'block' }} />
                    <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleInputChange} placeholder="Instagram" style={{ maxWidth: '150px' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Mão de Obra</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={2}>Funcionários</td>
                  <td className="td-label">Funcionários Fixos</td>
                  <td className="td-value"><input type="number" name="func_fixos" value={formData.func_fixos || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Funcionários Temporários</td>
                  <td className="td-value"><input type="number" name="func_temp" value={formData.func_temp || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ABA: PESQUISA */}
        <div className={`tab-panel ${activeTab === 'pesquisa' ? 'active' : ''}`}>
          <div className="section-card">
            <div className="section-title-bar">Participação em Pesquisas</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={3}>Dados de Pesquisa</td>
                  <td className="td-label">Aceita participar das pesquisas?</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="aceita_pesquisa" value="1" checked={formData.aceita_pesquisa === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="aceita_pesquisa" value="0" checked={formData.aceita_pesquisa === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Telefone para Pesquisas</td>
                  <td className="td-value"><input type="tel" name="telefone_pesquisa" value={formData.telefone_pesquisa || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
                <tr>
                  <td className="td-label">E-mail para Pesquisas</td>
                  <td className="td-value"><input type="email" name="email_pesquisa" value={formData.email_pesquisa || ''} onChange={handleInputChange} placeholder="—" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Indicadores ODS / Destinos Inteligentes</div>
            <table className="data-table">
              <tbody>
                {[
                  { name: 'ods3_plano', label: 'Plano de emergência e segurança (ODS 3)' },
                  { name: 'ods5_lideranca', label: 'Mulheres em funções de liderança (ODS 5)' },
                  { name: 'ods5_empreend', label: 'Mulher empreendedora (ODS 5)' },
                  { name: 'ods6_campanha', label: 'Campanha educ. ambiental / uso consciente de água e energia (ODS 6 / ODS 12)' },
                  { name: 'ods7_energia', label: 'Uso de fontes renováveis de energia (ODS 7)' },
                  { name: 'ods12_selo', label: 'Certificação / Selo de sustentabilidade (ODS 12)' },
                  { name: 'ods12_residuos', label: 'Campanhas de redução de resíduos (ODS 12)' },
                  { name: 'ods12_gestao', label: 'Práticas de gestão sustentável (ODS 12)' },
                  { name: 'ods14_hidrico', label: 'Plano de gestão de recursos hídricos (ODS 14)' },
                  { name: 'ods11_plano', label: 'Plano de gestão ambiental e de acessibilidade (ODS 11)' }
                ].map((item, idx) => (
                  <tr key={item.name}>
                    {idx === 0 && <td className="td-category" rowSpan={10}>ODS e Sustentabilidade</td>}
                    <td className="td-label">{item.label}</td>
                    <td className="td-value">
                      <div className="radio-group">
                        <label className="radio-item"><input type="radio" name={item.name} value="1" checked={formData[item.name] === '1'} onChange={handleInputChange} /> Sim</label>
                        <label className="radio-item"><input type="radio" name={item.name} value="0" checked={formData[item.name] === '0'} onChange={handleInputChange} /> Não</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ABA: ESTRUTURA */}
        <div className={`tab-panel ${activeTab === 'estrutura' ? 'active' : ''}`}>
          <div className="section-card">
            <div className="section-title-bar">Informações de Espaço Habitacional</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={5}>Informações de espaço habitacional</td>
                  <td className="td-label">Quantidade de unidades habitacionais (UHs)</td>
                  <td className="td-value"><input type="number" name="uhs" value={formData.uhs || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Quantidade de UHs para PCD</td>
                  <td className="td-value"><input type="number" name="uhs_pcd" value={formData.uhs_pcd || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Quantidade total de leitos</td>
                  <td className="td-value"><input type="number" name="leitos" value={formData.leitos || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Quantidade mínima de leitos por UH</td>
                  <td className="td-value"><input type="number" name="leitos_min" value={formData.leitos_min || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Quantidade máxima de leitos por UH</td>
                  <td className="td-value"><input type="number" name="leitos_max" value={formData.leitos_max || ''} onChange={handleInputChange} min="0" placeholder="—" style={{ maxWidth: '120px' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Funcionamento e Reservas</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={4}>Operação</td>
                  <td className="td-label">Funcionamento 24 horas</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="func_24h" value="1" checked={formData.func_24h === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="func_24h" value="0" checked={formData.func_24h === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Horário Check-in / Check-out</td>
                  <td className="td-value"><input type="text" name="checkin_checkout" value={formData.checkin_checkout || ''} onChange={handleInputChange} placeholder="Ex: 14h / 12h" style={{ maxWidth: '200px' }} /></td>
                </tr>
                <tr>
                  <td className="td-label">Sistema de reservas</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="reserva_direto" checked={!!formData.reserva_direto} onChange={handleInputChange} /> Direto</label>
                      <label className="check-item"><input type="checkbox" name="reserva_online" checked={!!formData.reserva_online} onChange={handleInputChange} /> Online (OTA)</label>
                      <label className="check-item"><input type="checkbox" name="reserva_agencia" checked={!!formData.reserva_agencia} onChange={handleInputChange} /> Agência</label>
                      <label className="check-item"><input type="checkbox" name="reserva_telefone" checked={!!formData.reserva_telefone} onChange={handleInputChange} /> Telefone</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Formas de pagamento aceitas</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="pgto_dinheiro" checked={!!formData.pgto_dinheiro} onChange={handleInputChange} /> Dinheiro</label>
                      <label className="check-item"><input type="checkbox" name="pgto_cartao_debito" checked={!!formData.pgto_cartao_debito} onChange={handleInputChange} /> Cartão de débito</label>
                      <label className="check-item"><input type="checkbox" name="pgto_cartao_credito" checked={!!formData.pgto_cartao_credito} onChange={handleInputChange} /> Cartão de crédito</label>
                      <label className="check-item"><input type="checkbox" name="pgto_pix" checked={!!formData.pgto_pix} onChange={handleInputChange} /> PIX</label>
                      <label className="check-item"><input type="checkbox" name="pgto_boleto" checked={!!formData.pgto_boleto} onChange={handleInputChange} /> Boleto</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Comodidades Gerais</div>
            <table className="data-table">
              <tbody>
                {[
                  { name: 'estacionamento', label: 'Estacionamento' },
                  { name: 'manobrista', label: 'Manobrista' },
                  { name: 'mensageiro', label: 'Mensageiro' },
                  { name: 'fumantes', label: 'Área para fumantes' },
                  { name: 'pet', label: 'Aceita animais de estimação (Pet-friendly)' }
                ].map((item, idx) => (
                  <tr key={item.name}>
                    {idx === 0 && <td className="td-category" rowSpan={5}>Estrutura geral</td>}
                    <td className="td-label">{item.label}</td>
                    <td className="td-value">
                      <div className="radio-group">
                        <label className="radio-item"><input type="radio" name={item.name} value="1" checked={formData[item.name] === '1'} onChange={handleInputChange} /> Sim</label>
                        <label className="radio-item"><input type="radio" name={item.name} value="0" checked={formData[item.name] === '0'} onChange={handleInputChange} /> Não</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ABA: SERVIÇOS E EQUIPAMENTOS */}
        <div className={`tab-panel ${activeTab === 'servicos' ? 'active' : ''}`}>
          <div className="section-card">
            <div className="section-title-bar">Atendimento em Língua Estrangeira</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={3}>Idiomas</td>
                  <td className="td-label">Inglês</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="idioma_ingles" value="1" checked={formData.idioma_ingles === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="idioma_ingles" value="0" checked={formData.idioma_ingles === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Espanhol</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="idioma_espanhol" value="1" checked={formData.idioma_espanhol === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="idioma_espanhol" value="0" checked={formData.idioma_espanhol === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Outro idioma</td>
                  <td className="td-value"><input type="text" name="idioma_outro" value={formData.idioma_outro || ''} onChange={handleInputChange} placeholder="Qual?" style={{ maxWidth: '200px' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Equipamentos das UHs</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category">UH — Equipamentos</td>
                  <td className="td-label">Equipamentos disponíveis nas UHs</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="uh_wifi" checked={!!formData.uh_wifi} onChange={handleInputChange} /> Internet sem fio (Wi-Fi)</label>
                      <label className="check-item"><input type="checkbox" name="uh_arcond" checked={!!formData.uh_arcond} onChange={handleInputChange} /> Ar-condicionado</label>
                      <label className="check-item"><input type="checkbox" name="uh_ventilador" checked={!!formData.uh_ventilador} onChange={handleInputChange} /> Ventilador/Climatizador</label>
                      <label className="check-item"><input type="checkbox" name="uh_frigobar" checked={!!formData.uh_frigobar} onChange={handleInputChange} /> Frigobar</label>
                      <label className="check-item"><input type="checkbox" name="uh_tv" checked={!!formData.uh_tv} onChange={handleInputChange} /> TV</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Recepção</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category">Área da Recepção</td>
                  <td className="td-label">Equipamentos / estrutura da recepção</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="rec_wifi" checked={!!formData.rec_wifi} onChange={handleInputChange} /> Internet sem fio</label>
                      <label className="check-item"><input type="checkbox" name="rec_arcond" checked={!!formData.rec_arcond} onChange={handleInputChange} /> Ar-condicionado</label>
                      <label className="check-item"><input type="checkbox" name="rec_ventilador" checked={!!formData.rec_ventilador} onChange={handleInputChange} /> Climatizador/Ventilador</label>
                      <label className="check-item"><input type="checkbox" name="rec_estar" checked={!!formData.rec_estar} onChange={handleInputChange} /> Área de estar</label>
                      <label className="check-item"><input type="checkbox" name="rec_sanitario" checked={!!formData.rec_sanitario} onChange={handleInputChange} /> Sanitário</label>
                      <label className="check-item"><input type="checkbox" name="rec_sanitario_pcd" checked={!!formData.rec_sanitario_pcd} onChange={handleInputChange} /> Sanitário PCD</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Alimentação e Bebidas (A&amp;B)</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={4}>A&amp;B</td>
                  <td className="td-label">Serviços de A&amp;B oferecidos</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="ab_cafe" checked={!!formData.ab_cafe} onChange={handleInputChange} /> Café da Manhã</label>
                      <label className="check-item"><input type="checkbox" name="ab_meia_pensao" checked={!!formData.ab_meia_pensao} onChange={handleInputChange} /> Meia Pensão</label>
                      <label className="check-item"><input type="checkbox" name="ab_pensao_completa" checked={!!formData.ab_pensao_completa} onChange={handleInputChange} /> Pensão Completa</label>
                      <label className="check-item"><input type="checkbox" name="ab_all_inclusive" checked={!!formData.ab_all_inclusive} onChange={handleInputChange} /> All-Inclusive</label>
                      <label className="check-item"><input type="checkbox" name="ab_room_service" checked={!!formData.ab_room_service} onChange={handleInputChange} /> Room Service</label>
                      <label className="check-item"><input type="checkbox" name="ab_restaurante" checked={!!formData.ab_restaurante} onChange={handleInputChange} /> Restaurante</label>
                      <label className="check-item"><input type="checkbox" name="ab_lanchonete" checked={!!formData.ab_lanchonete} onChange={handleInputChange} /> Lanchonete</label>
                      <label className="check-item"><input type="checkbox" name="ab_bar" checked={!!formData.ab_bar} onChange={handleInputChange} /> Bar</label>
                      <label className="check-item"><input type="checkbox" name="ab_bar_molhado" checked={!!formData.ab_bar_molhado} onChange={handleInputChange} /> Bar Molhado</label>
                      <label className="check-item"><input type="checkbox" name="ab_copa_bebe" checked={!!formData.ab_copa_bebe} onChange={handleInputChange} /> Copa do Bebê</label>
                    </div>
                  </td>
                </tr>
                {[
                  { name: 'ab_area_refeicoes', label: 'Área para refeições / copa' },
                  { name: 'ab_sanitario', label: 'Sanitário exclusivo para A&B' },
                  { name: 'ab_alim_dif', label: 'Alimentação diferenciada (diabéticos, celíacos, veganos etc.)' }
                ].map((item) => (
                  <tr key={item.name}>
                    <td className="td-label">{item.label}</td>
                    <td className="td-value">
                      <div className="radio-group">
                        <label className="radio-item"><input type="radio" name={item.name} value="1" checked={formData[item.name] === '1'} onChange={handleInputChange} /> Sim</label>
                        <label className="radio-item"><input type="radio" name={item.name} value="0" checked={formData[item.name] === '0'} onChange={handleInputChange} /> Não</label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Área de Eventos</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={4}>Eventos</td>
                  <td className="td-label">Possui área de eventos?</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="eventos_possui" value="1" checked={formData.eventos_possui === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="eventos_possui" value="0" checked={formData.eventos_possui === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Equipamentos da área de eventos</td>
                  <td className="td-value">
                    <div className="check-group">
                      <label className="check-item"><input type="checkbox" name="ev_arcond" checked={!!formData.ev_arcond} onChange={handleInputChange} /> Ar-condicionado</label>
                      <label className="check-item"><input type="checkbox" name="ev_ventilador" checked={!!formData.ev_ventilador} onChange={handleInputChange} /> Climatizador/Ventilador</label>
                      <label className="check-item"><input type="checkbox" name="ev_sanitario" checked={!!formData.ev_sanitario} onChange={handleInputChange} /> Sanitário exclusivo</label>
                      <label className="check-item"><input type="checkbox" name="ev_sanitario_pcd" checked={!!formData.ev_sanitario_pcd} onChange={handleInputChange} /> Sanitário PCD exclusivo</label>
                      <label className="check-item"><input type="checkbox" name="ev_mobiliario" checked={!!formData.ev_mobiliario} onChange={handleInputChange} /> Mobiliários</label>
                      <label className="check-item"><input type="checkbox" name="ev_audiovisual" checked={!!formData.ev_audiovisual} onChange={handleInputChange} /> Eq. Audiovisuais</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Aberto ao público externo</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="ev_aberto_publico" value="1" checked={formData.ev_aberto_publico === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="ev_aberto_publico" value="0" checked={formData.ev_aberto_publico === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Área de Recreação e Lazer</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category">Lazer</td>
                  <td className="td-label">Equipamentos / estrutura de lazer</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'lz_piscina', label: 'Piscina' },
                        { name: 'lz_piscina_inf', label: 'Piscina infantil' },
                        { name: 'lz_sauna', label: 'Sauna' },
                        { name: 'lz_spa', label: 'SPA / Ofurô' },
                        { name: 'lz_area_verde', label: 'Área Verde' },
                        { name: 'lz_descanso', label: 'Área de Descanso/Leitura' },
                        { name: 'lz_academia', label: 'Academia' },
                        { name: 'lz_quadra', label: 'Quadra Poliesportiva' },
                        { name: 'lz_salao_jogos', label: 'Salão de Jogos' },
                        { name: 'lz_lazer_criancas', label: 'Área de lazer para crianças' },
                        { name: 'lz_recreacao_criancas', label: 'Equipe de recreação para crianças' },
                        { name: 'lz_anfiteatro', label: 'Anfiteatro/Cinema' },
                        { name: 'lz_minigolf', label: 'Mini Golf/Golf' },
                        { name: 'lz_futebol', label: 'Mini Campo/Campo de futebol' },
                        { name: 'lz_sanitario', label: 'Sanitário exclusivo da área de lazer' },
                        { name: 'lz_sanitario_pcd', label: 'Sanitário PCD exclusivo' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ABA: ACESSIBILIDADE */}
        <div className={`tab-panel ${activeTab === 'acessibilidade' ? 'active' : ''}`}>
          <div className="section-card">
            <div className="section-title-bar">Acessibilidade Geral</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={2}>PCD</td>
                  <td className="td-label">Possui facilidades para pessoas com deficiência ou mobilidade reduzida?</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="acess_possui" value="1" checked={formData.acess_possui === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="acess_possui" value="0" checked={formData.acess_possui === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Tipos de deficiência atendidos</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'pcd_fisica', label: 'Física' },
                        { name: 'pcd_auditiva', label: 'Auditiva' },
                        { name: 'pcd_visual', label: 'Visual' },
                        { name: 'pcd_intelectual', label: 'Intelectual' },
                        { name: 'pcd_multipla', label: 'Múltipla' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Pessoal e Rota Externa</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={2}>Preparo</td>
                  <td className="td-label">Pessoal capacitado para receber PCD</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="pcd_pessoal" value="1" checked={formData.pcd_pessoal === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="pcd_pessoal" value="0" checked={formData.pcd_pessoal === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Rota externa acessível (calçada, rampa, faixa de pedestre etc.)</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'rota_calcada', label: 'Calçada rebaixada' },
                        { name: 'rota_faixa', label: 'Faixa de pedestre' },
                        { name: 'rota_rampa', label: 'Rampa' },
                        { name: 'rota_semaforo', label: 'Semáforo sonoro' },
                        { name: 'rota_piso_tatil', label: 'Piso tátil de alerta' },
                        { name: 'rota_piso_antid', label: 'Piso regular e antiderrapante' },
                        { name: 'rota_sem_obst', label: 'Livre de obstáculos' },
                        { name: 'rota_nivel', label: 'Acesso em nível' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Infraestrutura Interna de Acessibilidade</div>
            <table className="data-table">
              <tbody>
                {[
                  {
                    label: 'Embarque e desembarque',
                    items: [
                      { name: 'emb_sinalizado', label: 'Sinalizado' },
                      { name: 'emb_nivel', label: 'Com acesso em nível' },
                      { name: 'emb_sem_obst', label: 'Sem obstáculos' }
                    ]
                  },
                  {
                    label: 'Vaga em estacionamento (PCD)',
                    items: [
                      { name: 'vaga_sinalizada', label: 'Sinalizada' },
                      { name: 'vaga_nivel', label: 'Com acesso em nível' },
                      { name: 'vaga_alargada', label: 'Alargada para cadeira de rodas' },
                      { name: 'vaga_rampa', label: 'Rampa de acesso à calçada' }
                    ]
                  },
                  {
                    label: 'Área de circulação / acesso interno',
                    items: [
                      { name: 'circ_plataforma', label: 'Plataforma elevatória' },
                      { name: 'circ_circulacao', label: 'Com circulação entre mobiliário' },
                      { name: 'circ_porta_larga', label: 'Porta larga' }
                    ]
                  },
                  {
                    label: 'Escada',
                    items: [
                      { name: 'esc_corrimao', label: 'Corrimão' },
                      { name: 'esc_patamar', label: 'Patamar para descanso' },
                      { name: 'esc_piso_tatil', label: 'Sinalização/Piso tátil de alerta' },
                      { name: 'esc_sig_visual', label: 'Sinalização visual' },
                      { name: 'esc_piso_antid', label: 'Piso antiderrapante' }
                    ]
                  },
                  {
                    label: 'Rampa',
                    items: [
                      { name: 'rmp_corrimao', label: 'Corrimão' },
                      { name: 'rmp_patamar', label: 'Patamar para descanso' },
                      { name: 'rmp_piso_antid', label: 'Piso antiderrapante' },
                      { name: 'rmp_sig_tatil', label: 'Sinalização/Piso tátil' },
                      { name: 'rmp_inclinacao', label: 'Inclinação adequada' }
                    ]
                  },
                  {
                    label: 'Piso',
                    items: [
                      { name: 'piso_tatil', label: 'Tátil' },
                      { name: 'piso_regular', label: 'Regular, sem obstáculos' },
                      { name: 'piso_antid', label: 'Antiderrapante/Deslizante' }
                    ]
                  },
                  {
                    label: 'Elevador',
                    items: [
                      { name: 'elev_braille', label: 'Sinalizado em Braille' },
                      { name: 'elev_sonoro', label: 'Dispositivo sonoro' },
                      { name: 'elev_luminoso', label: 'Dispositivo luminoso' },
                      { name: 'elev_sensor', label: 'Sensor eletrônico (porta)' },
                      { name: 'elev_visual', label: 'Sinalização visual' }
                    ]
                  }
                ].map((row, index) => (
                  <tr key={index}>
                    {index === 0 && <td className="td-category" rowSpan={7}>Infraestrutura</td>}
                    <td className="td-label">{row.label}</td>
                    <td className="td-value">
                      <div className="check-group">
                        {row.items.map(chk => (
                          <label className="check-item" key={chk.name}>
                            <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Alarme de Emergência, Comunicação e Balcão</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={4}>Comunicação e Segurança</td>
                  <td className="td-label">Alarme de emergência acessível</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="alarme" value="1" checked={formData.alarme === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="alarme" value="0" checked={formData.alarme === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Locais com alarme de emergência</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'alarme_entrada', label: 'Entrada/Saída' },
                        { name: 'alarme_recepcao', label: 'Recepção' },
                        { name: 'alarme_sanitario', label: 'Sanitário' },
                        { name: 'alarme_eventos', label: 'Eventos' },
                        { name: 'alarme_restaurante', label: 'Restaurante' },
                        { name: 'alarme_lazer', label: 'Área de lazer' },
                        { name: 'alarme_resgate', label: 'Área de resgate' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Comunicação para PCD</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'com_braille', label: 'Texto em Braille' },
                        { name: 'com_fonte_amp', label: 'Texto com fonte ampliada' },
                        { name: 'com_libras', label: 'Intérprete em Libras' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Balcão de atendimento acessível</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'balcao_rebaixado', label: 'Rebaixado' },
                        { name: 'balcao_preferencial', label: 'Preferencial para PCD' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Sanitário e Telefone Acessíveis</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category" rowSpan={2}>Sanitário / Telefone</td>
                  <td className="td-label">Sanitário adaptado para PCD</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'san_barra', label: 'Barra de apoio' },
                        { name: 'san_porta_larga', label: 'Porta larga p/ cadeira de rodas' },
                        { name: 'san_giro', label: 'Acesso e giro p/ cadeira de rodas' },
                        { name: 'san_pia', label: 'Pia rebaixada' },
                        { name: 'san_espelho', label: 'Espelho rebaixado' },
                        { name: 'san_box', label: 'Box ou banheira adaptada' },
                        { name: 'san_torneira', label: 'Torneira monocomando/alavanca' },
                        { name: 'san_piso', label: 'Piso regular, sem obstáculos' },
                        { name: 'san_piso_tatil', label: 'Piso tátil' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="td-label">Telefone acessível</td>
                  <td className="td-value">
                    <div className="check-group">
                      {[
                        { name: 'tel_altura', label: 'Altura adequada' },
                        { name: 'tel_surdos', label: 'Para surdos (TPS ou TTS)' }
                      ].map(chk => (
                        <label className="check-item" key={chk.name}>
                          <input type="checkbox" name={chk.name} checked={!!formData[chk.name]} onChange={handleInputChange} /> {chk.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section-card">
            <div className="section-title-bar">Sinalização Indicativa para PCD</div>
            <table className="data-table">
              <tbody>
                <tr>
                  <td className="td-category">Sinalização</td>
                  <td className="td-label">Possui sinalização indicativa de atendimento preferencial para PCD?</td>
                  <td className="td-value">
                    <div className="radio-group">
                      <label className="radio-item"><input type="radio" name="sig_pcd" value="1" checked={formData.sig_pcd === '1'} onChange={handleInputChange} /> Sim</label>
                      <label className="radio-item"><input type="radio" name="sig_pcd" value="0" checked={formData.sig_pcd === '0'} onChange={handleInputChange} /> Não</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </form>
  );
}