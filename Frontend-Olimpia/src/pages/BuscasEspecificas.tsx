import { useState, useEffect } from 'react';
import { 
  listarTiposEmpresa, 
  listarRelatorioNumeroEmpresas, 
  listarRelatorioLeitos, 
  listarRelatorioDiariaMedia,
  type TipoEmpresaDTO 
} from "../services/BuscasEspecificasService";
import { GraficoLinha } from "../components/GraficosGenericos";

type TipoRelatorio = 'empresas' | 'leitos' | 'diarias' | null;

export function BuscasEspecificas() {
  const [selecionado, setSelecionado] = useState<TipoRelatorio>(null);
  
  // Estados para as categorias
  const [tiposEmpresa, setTiposEmpresa] = useState<TipoEmpresaDTO[]>([]);
  const [isLoadingTipos, setIsLoadingTipos] = useState<boolean>(true);

  // Estados para os dados dos gráficos do relatório selecionado
  const [isLoadingDados, setIsLoadingDados] = useState<boolean>(false);
  const [dadosGerais, setDadosGerais] = useState<any[]>([]);
  const [dadosEspecificos, setDadosEspecificos] = useState<Record<number, any[]>>({});

  const MENU_OPCOES = [
    { id: 'empresas' as TipoRelatorio, titulo: 'Número de empresas', subtitulo: 'Evolução de estabelecimentos', icone: 'ti-building', cor: '#2563eb', bgCor: '#eff6ff', chaveValor: 'quantidadeEmpresas', eixoY: 'Quantidade' },
    { id: 'leitos' as TipoRelatorio, titulo: 'Leitos por mês', subtitulo: 'Capacidade hoteleira', icone: 'ti-bed', cor: '#16a34a', bgCor: '#f0fdf4', chaveValor: 'totalLeitos', eixoY: 'Qtd. Leitos' },
    { id: 'diarias' as TipoRelatorio, titulo: 'Taxas de diária médias', subtitulo: 'Valores praticados (R$)', icone: 'ti-cash', cor: '#d97706', bgCor: '#fffbeb', chaveValor: 'valorDiaria', eixoY: 'Valor (R$)' },
  ];

  const opcaoAtiva = MENU_OPCOES.find(op => op.id === selecionado);

  // 1. Efeito que roda apenas 1 vez ao abrir a tela (Busca os tipos de empresa)
  useEffect(() => {
    async function buscarTipos() {
      try {
        setIsLoadingTipos(true);
        const resposta = await listarTiposEmpresa();
        setTiposEmpresa(resposta);
      } catch (error) {
        console.error("Erro ao buscar tipos de empresa:", error);
      } finally {
        setIsLoadingTipos(false);
      }
    }
    buscarTipos();
  }, []);

  // 2. Efeito que roda toda vez que o usuário troca de aba
  useEffect(() => {
    if (!selecionado || tiposEmpresa.length === 0) return;

    async function buscarDadosDoRelatorio() {
      try {
        setIsLoadingDados(true);
        
        let funcaoBusca: (nomeTipo?: string) => Promise<any[]>;
        
        if (selecionado === 'empresas') funcaoBusca = listarRelatorioNumeroEmpresas;
        else if (selecionado === 'leitos') funcaoBusca = listarRelatorioLeitos;
        else funcaoBusca = listarRelatorioDiariaMedia;

        // Dispara a busca Geral (sem parâmetros)
        const promessaGeral = funcaoBusca();
        
        const promessasEspecificas = tiposEmpresa.map(tipo => funcaoBusca(tipo.nomeTipo));

        // Aguarda todas as requisições terminarem ao mesmo tempo
        const [resGeral, ...resEspecificos] = await Promise.all([promessaGeral, ...promessasEspecificas]);

        // Formata os dados gerais injetando o nome da série
        setDadosGerais(resGeral.map(item => ({ ...item, serie: "Visão Geral" })));

        // Mapeia os resultados específicos
        // Importante: Continuamos usando o idTipo como "chave" (key) interna do dicionário React
        // pois é mais seguro e performático organizar estados por ID do que por strings com acentos
        const mapaEspecificos: Record<number, any[]> = {};
        tiposEmpresa.forEach((tipo, index) => {
          mapaEspecificos[tipo.idTipo] = resEspecificos[index].map(item => ({ ...item, serie: tipo.nomeTipo }));
        });
        
        setDadosEspecificos(mapaEspecificos);

      } catch (error) {
        console.error(`Erro ao buscar dados para ${selecionado}:`, error);
      } finally {
        setIsLoadingDados(false);
      }
    }

    buscarDadosDoRelatorio();
  }, [selecionado, tiposEmpresa]);


  return (
    <div style={{ height: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', overflow: 'hidden' }}>
        
        {/* COLUNA ESQUERDA: Menu */}
        <div style={{ width: '35%', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', backgroundColor: '#fdfdfd' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Painel de Indicadores
            </label>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Selecione uma análise para visualizar
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

        {/* COLUNA DIREITA: Área dos Gráficos */}
        <div style={{ width: '65%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
          {selecionado ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Cabeçalho Fixo */}
              <div style={{ padding: '30px 30px 20px 30px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: opcaoAtiva?.bgCor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={opcaoAtiva?.icone} style={{ fontSize: '24px', color: opcaoAtiva?.cor }}></i>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, color: '#333', fontSize: '22px' }}>{opcaoAtiva?.titulo}</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Visão consolidada e quebra por categoria</p>
                  </div>
                </div>
              </div>

              {/* Área Scrollável */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                
                {isLoadingDados || isLoadingTipos ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                    <i className="ti ti-loader-2 loading-spinner" style={{ fontSize: '32px', color: opcaoAtiva?.cor, marginBottom: '15px' }}></i>
                    <h3>Processando matriz de dados...</h3>
                  </div>
                ) : (
                  <>
                    {/* GRÁFICO GERAL */}
                    <div style={{ marginBottom: '50px' }}>
                      <h3 style={{ fontSize: '18px', color: '#1f2937', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ti ti-chart-area-line" style={{ color: opcaoAtiva?.cor }}></i>
                        Visão Geral (Todos os estabelecimentos)
                      </h3>
                      
                      {dadosGerais.length > 0 ? (
                        <div style={{ width: '100%', height: '350px' }}>
                          <GraficoLinha
                            dados={dadosGerais}
                            chavesX={["mes", "ano"]} 
                            chavesSerie={["serie"]} 
                            chaveValor={opcaoAtiva?.chaveValor || ""} 
                            nomeEixoX="Mês/Ano"
                            nomeEixoY={opcaoAtiva?.eixoY}
                          />
                        </div>
                      ) : (
                        <div style={{ height: '350px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sem dados disponíveis</div>
                      )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '40px' }} />

                    {/* GRÁFICOS ESPECÍFICOS */}
                    {tiposEmpresa.map((tipo) => {
                      const dadosDesteTipo = dadosEspecificos[tipo.idTipo] || [];

                      return (
                        <div key={tipo.idTipo} style={{ marginBottom: '50px' }}>
                          <h3 style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ti ti-point" style={{ color: opcaoAtiva?.cor }}></i>
                            Recorte: {tipo.nomeTipo}
                          </h3>
                          
                          {dadosDesteTipo.length > 0 ? (
                            <div style={{ width: '100%', height: '300px' }}>
                              <GraficoLinha
                                dados={dadosDesteTipo}
                                chavesX={["mes", "ano"]} 
                                chavesSerie={["serie"]} 
                                chaveValor={opcaoAtiva?.chaveValor || ""} 
                                nomeEixoX="Mês/Ano"
                                nomeEixoY={opcaoAtiva?.eixoY}
                              />
                            </div>
                          ) : (
                            <div style={{ height: '150px', border: '1px dashed #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', backgroundColor: '#fafafa' }}>
                              Sem dados registrados para esta categoria.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', backgroundColor: '#fafafa' }}>
              <i className="ti ti-chart-bar" style={{ fontSize: '60px', marginBottom: '20px', color: '#ddd' }}></i>
              <h3 style={{ margin: 0, color: '#666', fontSize: '20px' }}>Nenhum relatório selecionado</h3>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>Escolha um dos indicadores na lista ao lado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}