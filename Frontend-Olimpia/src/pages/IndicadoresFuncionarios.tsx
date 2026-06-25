import { useState, useEffect } from 'react';
import { 
  type RelatorioEmpresasFormatado, 
  type RelatorioLeitosFormatado, 
  type RelatorioDiariaMediaFormatado,
  listarRelatorioNumeroEmpresas,
  listarRelatorioLeitos,
  listarRelatorioDiariaMedia
} from "../services/IndicadoresGeraisService";
import { GraficoLinha } from "../components/GraficosGenericos";

export function IndicadoresFuncionarios() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Separamos os estados para cada um dos gráficos
  const [dadosEmpresas, setDadosEmpresas] = useState<RelatorioEmpresasFormatado[]>([]);
  const [dadosLeitos, setDadosLeitos] = useState<RelatorioLeitosFormatado[]>([]);
  const [dadosDiaria, setDadosDiaria] = useState<RelatorioDiariaMediaFormatado[]>([]);

  useEffect(() => {
    async function buscarDados() {
      try {
        setIsLoading(true);
        
        // Promise.all executa as três chamadas simultaneamente e aguarda todas terminarem
        const [resEmpresas, resLeitos, resDiaria] = await Promise.all([
          listarRelatorioNumeroEmpresas(),
          listarRelatorioLeitos(),
          listarRelatorioDiariaMedia()
        ]);
        
        // Mapeamos as séries para gerar as legendas corretamente
        setDadosEmpresas(resEmpresas.map(item => ({ ...item, serie: "Empresas Ativas" })));
        setDadosLeitos(resLeitos.map(item => ({ ...item, serie: "Total de Leitos" })));
        setDadosDiaria(resDiaria.map(item => ({ ...item, serie: "Diária Média (R$)" })));
        
      } catch (error) {
        console.error("Erro ao buscar os dados dos gráficos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    buscarDados();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // Alterado para acomodar múltiplos itens sem espremer
      minHeight: 'calc(100vh - 160px)',
      padding: '40px 20px',
      gap: '40px', // Espaçamento entre os gráficos
      width: '100%'
    }}>
      {isLoading ? (
        <div className="empty-state" style={{ marginTop: '100px', textAlign: 'center' }}>
          <i className="ti ti-loader-2 loading-spinner" style={{ fontSize: '32px', color: '#0056b3' }}></i>
          <h3>Construindo painel de métricas...</h3>
        </div>
      ) : (
        <>
          {/* ============================================================
              GRÁFICO 1: EVOLUÇÃO DE EMPRESAS 
              ============================================================ */}
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #e5e7eb',
            width: '100%',
            maxWidth: '900px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-building" style={{ fontSize: '24px', color: '#2563eb' }}></i>
              </div>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '22px', fontWeight: 600 }}>
                Evolução de Estabelecimentos Cadastrados
              </h2>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
              <GraficoLinha
                dados={dadosEmpresas}
                chavesX={["mes", "ano"]} 
                chavesSerie={["serie"]} 
                chaveValor="quantidadeEmpresas" 
                nomeEixoX="Mês/Ano"
                nomeEixoY="Quantidade"
              />
            </div>
          </div>

          {/* ============================================================
              GRÁFICO 2: EVOLUÇÃO DE LEITOS 
              ============================================================ */}
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #e5e7eb',
            width: '100%',
            maxWidth: '900px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-bed" style={{ fontSize: '24px', color: '#16a34a' }}></i>
              </div>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '22px', fontWeight: 600 }}>
                Evolução do Total de Leitos
              </h2>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
              <GraficoLinha
                dados={dadosLeitos}
                chavesX={["mes", "ano"]} 
                chavesSerie={["serie"]} 
                chaveValor="totalLeitos" 
                nomeEixoX="Mês/Ano"
                nomeEixoY="Leitos"
              />
            </div>
          </div>

          {/* ============================================================
              GRÁFICO 3: EVOLUÇÃO DE DIÁRIA MÉDIA 
              ============================================================ */}
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            border: '1px solid #e5e7eb',
            width: '100%',
            maxWidth: '900px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fffbeb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-cash" style={{ fontSize: '24px', color: '#d97706' }}></i>
              </div>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '22px', fontWeight: 600 }}>
                Evolução da Diária Média (R$)
              </h2>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
              <GraficoLinha
                dados={dadosDiaria}
                chavesX={["mes", "ano"]} 
                chavesSerie={["serie"]} 
                chaveValor="valorDiaria" 
                nomeEixoX="Mês/Ano"
                nomeEixoY="Valor (R$)"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}