import { useState, useEffect } from 'react';
import { listarTiposEmpresa, type TipoEmpresaDTO } from "../services/BuscasEspecificasService";
import { inserirEmpresa, type EmpresaCompletaDTO } from "../services/EmpresaService";

type TipoFormulario = 'empresa' | 'taxaOcupacao' | 'diariaMedia' | 'qtdHospedes' | 'qtdLeitos' | 'qtdUhs' | null;

export function InserirFuncionarios() {
  const [selecionado, setSelecionado] = useState<TipoFormulario>(null);
  const [tiposEmpresa, setTiposEmpresa] = useState<TipoEmpresaDTO[]>([]);
  
  // Estado para controlar o botão de envio (loading)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado que armazena os dados do formulário de Empresa Geral
  const [formData, setFormData] = useState({
    tipo: '',
    razaoSocial: '',
    nomeFantasia: '',
    dataAbertura: '',
    proprietarios: '',
    cnae: '',
    cadastur: '',
    numCadastur: '',
    vencCadastur: '',
    endereco: '',
    bairro: '',
    localizacao: '',
    regiao: '',
    telComercial: '',
    emailComercial: '',
    site: '',
    redesSociais: '',
    funcFixos: '',
    funcTemporarios: ''
  });

  // Busca os tipos de empresa para o Select assim que o componente é montado
  useEffect(() => {
    listarTiposEmpresa()
      .then(setTiposEmpresa)
      .catch(erro => console.error("Erro ao carregar os tipos de empresa:", erro));
  }, []);

  // Função genérica para atualizar qualquer campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // A função agora é assíncrona e envia os dados para a API
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // 1. Montamos o objeto no formato exato que a API espera (EmpresaCompletaDTO)
      // Como os inputs HTML devolvem sempre strings, convertemos os números com parseInt e vazios para null
      const payload: EmpresaCompletaDTO = {
        dadosGerais: {
          tipo: formData.tipo,
          razaoSocial: formData.razaoSocial,
          nomeFantasia: formData.nomeFantasia || undefined,
          dataAbertura: formData.dataAbertura || null,
          proprietarios: formData.proprietarios || undefined,
          cnae: formData.cnae || undefined,
          cadastur: formData.cadastur || undefined,
          numCadastur: formData.numCadastur || undefined,
          vencCadastur: formData.vencCadastur || null,
          endereco: formData.endereco || undefined,
          bairro: formData.bairro || undefined,
          localizacao: formData.localizacao || undefined,
          regiao: formData.regiao || undefined,
          telComercial: formData.telComercial || undefined,
          emailComercial: formData.emailComercial || undefined,
          site: formData.site || undefined,
          redesSociais: formData.redesSociais || undefined,
          funcFixos: formData.funcFixos ? parseInt(formData.funcFixos) : null,
          funcTemporarios: formData.funcTemporarios ? parseInt(formData.funcTemporarios) : null,
        }
      };

      // 2. Disparamos a requisição para o backend em C#
      const novoId = await inserirEmpresa(payload);
      
      alert(`Empresa registada com sucesso!`);
      
      // 3. Limpamos o formulário após o sucesso para permitir um novo registo
      setFormData({
        tipo: '', razaoSocial: '', nomeFantasia: '', dataAbertura: '', proprietarios: '', 
        cnae: '', cadastur: '', numCadastur: '', vencCadastur: '', endereco: '', bairro: '', 
        localizacao: '', regiao: '', telComercial: '', emailComercial: '', site: '', 
        redesSociais: '', funcFixos: '', funcTemporarios: ''
      });

    } catch (error) {
      console.error("Erro ao gravar empresa:", error);
      alert("Ocorreu um erro ao tentar gravar os dados. Verifique o console para mais detalhes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const MENU_OPCOES = [
    { id: 'empresa' as TipoFormulario, titulo: 'Empresa', subtitulo: 'Cadastro e dados gerais', icone: 'ti-building', cor: '#2563eb', bgCor: '#eff6ff' },
    { id: 'taxaOcupacao' as TipoFormulario, titulo: 'Taxa de ocupação', subtitulo: 'Percentual mensal', icone: 'ti-percentage', cor: '#16a34a', bgCor: '#f0fdf4' },
    { id: 'diariaMedia' as TipoFormulario, titulo: 'Diária média', subtitulo: 'Valores praticados (R$)', icone: 'ti-cash', cor: '#d97706', bgCor: '#fffbeb' },
    { id: 'qtdHospedes' as TipoFormulario, titulo: 'Quantidade de hóspedes', subtitulo: 'Volume de clientes', icone: 'ti-users', cor: '#7c3aed', bgCor: '#f3e8ff' },
    { id: 'qtdLeitos' as TipoFormulario, titulo: 'Quantidade de leitos', subtitulo: 'Capacidade hoteleira', icone: 'ti-bed', cor: '#0891b2', bgCor: '#cffafe' },
    { id: 'qtdUhs' as TipoFormulario, titulo: 'Quantidade de UHs', subtitulo: 'Unidades habitacionais', icone: 'ti-door', cor: '#dc2626', bgCor: '#fee2e2' },
  ];

  const opcaoAtiva = MENU_OPCOES.find(op => op.id === selecionado);

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '6px' };
  const inputStyle = { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '6px', 
    border: '1px solid #d1d5db', 
    fontSize: '14px', 
    outline: 'none', 
    backgroundColor: '#f9fafb', 
    color: '#1f2937',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ height: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', overflow: 'hidden' }}>
        
        {/* COLUNA ESQUERDA: Menu */}
        <div style={{ width: '35%', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfd' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Inserção de Dados
            </label>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Selecione o módulo para lançamento
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {MENU_OPCOES.map((opcao) => (
              <div 
                key={opcao.id} 
                onClick={() => setSelecionado(opcao.id)}
                style={{ 
                  padding: '20px', borderBottom: '1px solid #eee', cursor: 'pointer',
                  backgroundColor: selecionado === opcao.id ? '#f0f7ff' : 'transparent',
                  borderLeft: selecionado === opcao.id ? `4px solid ${opcao.cor}` : '4px solid transparent',
                  display: 'flex', alignItems: 'center', gap: '15px', transition: 'background-color 0.2s'
                }}
              >
                <div style={{ width: '40px', height: '40px', backgroundColor: opcao.bgCor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={opcao.icone} style={{ fontSize: '20px', color: opcao.cor }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>{opcao.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{opcao.subtitulo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: Formulários */}
        <div style={{ width: '65%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
          {selecionado ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Cabeçalho */}
              <div style={{ padding: '30px 30px 20px 30px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: opcaoAtiva?.bgCor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={opcaoAtiva?.icone} style={{ fontSize: '24px', color: opcaoAtiva?.cor }}></i>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, color: '#333', fontSize: '22px' }}>{opcaoAtiva?.titulo}</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Preencha os campos para salvar na base de dados</p>
                  </div>
                </div>
              </div>

              {/* Área Dinâmica (Onde o formulário de Empresa foi injetado) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                
                {selecionado === 'empresa' ? (
                  <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827' }}>Identificação Principal</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <label style={labelStyle}>Tipo de Estabelecimento</label>
                          <select name="tipo" value={formData.tipo} onChange={handleChange} style={inputStyle} required>
                            <option value="">Selecione uma categoria...</option>
                            {tiposEmpresa.map(tipo => (
                              <option key={tipo.idTipo} value={tipo.nomeTipo}>{tipo.nomeTipo}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>CNPJ / CNAE</label>
                          <input type="text" name="cnae" value={formData.cnae} onChange={handleChange} style={inputStyle} placeholder="Opcional" />
                        </div>
                        <div>
                          <label style={labelStyle}>Razão Social</label>
                          <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                          <label style={labelStyle}>Nome Fantasia</label>
                          <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Data de Abertura</label>
                          <input type="date" name="dataAbertura" value={formData.dataAbertura} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                          <label style={labelStyle}>Proprietários / Sócios</label>
                          <input type="text" name="proprietarios" value={formData.proprietarios} onChange={handleChange} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827' }}>Regulação (Cadastur)</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div>
                          <label style={labelStyle}>Situação</label>
                          <input type="text" name="cadastur" value={formData.cadastur} onChange={handleChange} style={inputStyle} placeholder="Ex: Regular" />
                        </div>
                        <div>
                          <label style={labelStyle}>Número do Cadastro</label>
                          <input type="text" name="numCadastur" value={formData.numCadastur} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Data de Vencimento</label>
                          <input type="date" name="vencCadastur" value={formData.vencCadastur} onChange={handleChange} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827' }}>Localização</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                        <div>
                          <label style={labelStyle}>Endereço Completo</label>
                          <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Bairro</label>
                          <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Localização (Urbana/Rural)</label>
                          <input type="text" name="localizacao" value={formData.localizacao} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Região Turística</label>
                          <input type="text" name="regiao" value={formData.regiao} onChange={handleChange} style={inputStyle} />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827' }}>Contato e Pessoal</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <label style={labelStyle}>Telefone Comercial</label>
                          <input type="text" name="telComercial" value={formData.telComercial} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>E-mail Comercial</label>
                          <input type="email" name="emailComercial" value={formData.emailComercial} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Website</label>
                          <input type="text" name="site" value={formData.site} onChange={handleChange} style={inputStyle} placeholder="www..." />
                        </div>
                        <div>
                          <label style={labelStyle}>Redes Sociais</label>
                          <input type="text" name="redesSociais" value={formData.redesSociais} onChange={handleChange} style={inputStyle} placeholder="@utilizador" />
                        </div>
                        <div>
                          <label style={labelStyle}>Funcionários Fixos (Qtd)</label>
                          <input type="number" name="funcFixos" value={formData.funcFixos} onChange={handleChange} style={inputStyle} min="0" />
                        </div>
                        <div>
                          <label style={labelStyle}>Funcionários Temporários (Qtd)</label>
                          <input type="number" name="funcTemporarios" value={formData.funcTemporarios} onChange={handleChange} style={inputStyle} min="0" />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={{ 
                          padding: '12px 24px', 
                          backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontWeight: 600, 
                          cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <i className={isSubmitting ? "ti ti-loader-2 loading-spinner" : "ti ti-device-floppy"} style={{ fontSize: '18px' }}></i>
                        {isSubmitting ? 'A gravar...' : 'Gravar Empresa'}
                      </button>
                    </div>

                  </form>
                ) : (
                  <div style={{ flex: 1, border: '2px dashed #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', color: '#9ca3af', minHeight: '300px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <i className="ti ti-forms" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                      <p>O formulário de inserção para <strong>{opcaoAtiva?.titulo}</strong> será injetado aqui.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', backgroundColor: '#fafafa' }}>
              <i className="ti ti-edit" style={{ fontSize: '60px', marginBottom: '20px', color: '#ddd' }}></i>
              <h3 style={{ margin: 0, color: '#666', fontSize: '20px' }}>Nenhum módulo selecionado</h3>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>Escolha uma das opções na lista ao lado para inserir novos dados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}