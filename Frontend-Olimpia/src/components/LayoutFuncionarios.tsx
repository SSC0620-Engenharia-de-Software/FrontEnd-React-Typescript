import { Outlet } from 'react-router-dom';
import { NavegacaoFuncionario } from './NavegacaoFuncionario';
import { Topbar } from './Topbar';

export function LayoutFuncionario() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Barra Lateral Fixa */}
      <NavegacaoFuncionario />
      
      {/* Conteúdo da Direita (Topbar + Páginas) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar userName="Fulano" />
        
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {/* O Outlet é onde o React Router vai injetar a página atual */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}