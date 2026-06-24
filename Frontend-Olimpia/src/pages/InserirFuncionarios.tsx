export function InserirFuncionarios() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 160px)',
      textAlign: 'center',
      padding: '20px'
    }}>
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
          backgroundColor: '#fff7ed',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <i className="ti ti-database-plus" style={{ fontSize: '32px', color: '#ea580c' }}></i>
        </div>
        <h2 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '22px', fontWeight: 600 }}>
          Inserção e Importação de Dados
        </h2>
        <p style={{ margin: '0 0 25px 0', color: '#4b5563', fontSize: '15px', lineHeight: '1.5' }}>
          O formulário para cadastro manual e a área de upload de planilhas de novos funcionários estão sendo integrados ao banco de dados e estarão disponíveis em breve.
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
          <i className="ti ti-tools"></i>  •  V0.1
        </div>
      </div>
    </div>
  );
}