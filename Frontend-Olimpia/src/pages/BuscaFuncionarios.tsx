import { useState } from 'react';

// Criamos um tipo para definir o que é um Funcionário no nosso sistema
interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  matricula: string;
}

// Dados falsos apenas para testar a interface
const DADOS_MOCK: Funcionario[] = [
  { id: 1, nome: 'Ana Silva', cargo: 'Desenvolvedora Front-end', departamento: 'Tecnologia', matricula: '10024' },
  { id: 2, nome: 'Carlos Mendes', cargo: 'Analista de Dados', departamento: 'Tecnologia', matricula: '10045' },
  { id: 3, nome: 'Beatriz Costa', cargo: 'Gerente de RH', departamento: 'Recursos Humanos', matricula: '20011' },
  { id: 4, nome: 'João Pedro', cargo: 'Assistente Administrativo', departamento: 'Administração', matricula: '30092' },
  { id: 5, nome: 'Mariana Souza', cargo: 'Designer UX/UI', departamento: 'Tecnologia', matricula: '10078' },
];

export function BuscaFuncionarios() {
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [selecionado, setSelecionado] = useState<Funcionario | null>(null);

  // Filtra a lista em tempo real conforme o usuário digita
  const funcionariosFiltrados = DADOS_MOCK.filter(func => 
    func.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    func.matricula.includes(termoBusca)
  );

  return (
    <div style={{ height: '100%', padding: '20px' }}>
      
      {/* Container Principal que imita a borda do seu print */}
      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 120px)', // Ocupa a tela descontando o Topbar
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        backgroundColor: '#fff',
        overflow: 'hidden'
      }}>
        
        {/* COLUNA ESQUERDA: Busca e Lista */}
        <div style={{ 
          width: '35%', 
          borderRight: '1px solid #ccc', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {/* Header da Busca */}
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Busca
            </label>
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '12px', top: '10px', color: '#999' }}></i>
              <input 
                type="text" 
                placeholder="digite aqui" 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 10px 10px 35px', 
                  borderRadius: '6px', 
                  border: '1px solid #ddd',
                  backgroundColor: '#f9f9f9',
                  outline: 'none'
                }} 
              />
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
              {funcionariosFiltrados.length} Dados encontrados 
            </div>
          </div>

          {/* Lista de Resultados */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {funcionariosFiltrados.map((func) => (
              <div 
                key={func.id} 
                onClick={() => setSelecionado(func)}
                style={{ 
                  padding: '15px 20px', 
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  // Se o item estiver selecionado, muda a cor de fundo levemente
                  backgroundColor: selecionado?.id === func.id ? '#f0f7ff' : '#fff',
                  borderLeft: selecionado?.id === func.id ? '4px solid #0056b3' : '4px solid transparent'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333' }}>{func.nome}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', backgroundColor: '#eee', padding: '2px 8px', borderRadius: '12px', color: '#666' }}>
                    {func.departamento}
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#eee', padding: '2px 8px', borderRadius: '12px', color: '#666' }}>
                    Mat: {func.matricula}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                  Cargo: {func.cargo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: Detalhes do Dado Selecionado */}
        <div style={{ width: '65%', backgroundColor: '#fafafa', position: 'relative' }}>
          
          {selecionado ? (
            // O QUE MOSTRAR QUANDO ALGUÉM FOR CLICADO
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#333' }}>{selecionado.nome}</h2>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>{selecionado.cargo}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 15px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    <i className="ti ti-printer"></i> Imprimir Ficha
                  </button>
                </div>
              </div>

              {/* Aqui você pode adicionar mais informações do funcionário */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                <p><strong>Matrícula:</strong> {selecionado.matricula}</p>
                <p><strong>Departamento:</strong> {selecionado.departamento}</p>
                <p><strong>Status:</strong> Ativo</p>
                {/* O "print do dado" que você mencionou entraria aqui! */}
              </div>
            </div>
          ) : (
            // O QUE MOSTRAR QUANDO NADA ESTIVER SELECIONADO (Estado Vazio igual ao print)
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}>
              <i className="ti ti-arrow-left" style={{ fontSize: '40px', marginBottom: '15px', color: '#ccc' }}></i>
              <h3 style={{ margin: 0, color: '#666' }}>Selecione um registro</h3>
              <p style={{ marginTop: '5px' }}>Clique em um item da lista ao lado para visualizar os dados</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}