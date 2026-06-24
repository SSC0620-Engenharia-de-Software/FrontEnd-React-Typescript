import { useState } from 'react';

export function BuscaEspecifica() {
  // Estado para guardar o que o usuário digita na barra
  const [termoBusca, setTermoBusca] = useState<string>('');

  // Função que é chamada quando o usuário aperta Enter ou clica no botão
  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    
    console.log(`Iniciando busca por: ${termoBusca}`);
  };

  return (
    <div className="busca-wrapper" style={{ padding: '20px' }}>
      <div className="busca-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Pesquisa de Funcionários</h2>
        <p style={{ color: '#666', margin: 0 }}>Busque pelo nome, matrícula ou departamento.</p>
      </div>

      {/* Usamos a tag form para que o "Enter" no teclado funcione automaticamente */}
      <form onSubmit={handleBusca} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <i 
            className="ti ti-search" 
            style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
          ></i>
          <input
            type="text"
            placeholder="Digite o nome do funcionário..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 40px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>
        <button 
          type="submit" 
          style={{
            padding: '0 25px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Buscar
        </button>
      </form>

      {/* tabela de resultados aqui */}
      <div className="busca-resultados" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        {termoBusca === '' ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
            <i className="ti ti-users" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
            <p>Utilize a barra acima para encontrar registros.</p>
          </div>
        ) : (
          <p>Exibindo resultados para: <strong>{termoBusca}</strong></p>
        )}
      </div>
    </div>
  );
}