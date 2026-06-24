import { useState, useEffect } from 'react';

export function IndicadoresFuncionarios() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Carregamento rápido apenas para dar um efeito realista

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 160px)', // Desconta a altura do Topbar e margens
      textAlign: 'center',
      padding: '20px'
    }}>
      {isLoading ? (
        <div className="empty-state">
          <i className="ti ti-loader-2 loading-spinner" style={{ fontSize: '32px', color: '#0056b3' }}></i>
          <h3>Buscando métricas...</h3>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          padding: '40px 60px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          border: '1px solid #e5e7eb',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eff6ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <i className="ti ti-chart-bar" style={{ fontSize: '32px', color: '#2563eb' }}></i>
          </div>
          <h2 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '22px', fontWeight: 600 }}>
            Painel de Indicadores Gerais
          </h2>
          <p style={{ margin: '0 0 25px 0', color: '#4b5563', fontSize: '15px', lineHeight: '1.5' }}>
            Este módulo está passando por atualizações de infraestrutura. Em breve você poderá visualizar gráficos de desempenho, relatórios consolidados e taxas de ocupação.
          </p>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '13px', 
            color: '#9ca3af', 
            backgroundColor: '#f9fafb', 
            padding: '6px 16px', 
            borderRadius: '20px',
            border: '1px solid #f3f4f6'
          }}>
            <i className="ti ti-clock"></i> V0.1 em construção
          </div>
        </div>
      )}
    </div>
  );
}