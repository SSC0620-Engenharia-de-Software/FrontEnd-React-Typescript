import { NavLink } from 'react-router-dom';

export function NavegacaoFuncionario() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="page-label">Gerenciamento de<br />Funcionários</div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/funcionario/indicadores" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="ti ti-chart-bar"></i> Indicadores Gerais
        </NavLink>
        
        <NavLink 
          to="/funcionario/busca" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="ti ti-search"></i> Busca Específica
        </NavLink>
        
        <NavLink 
          to="/funcionario/inserir" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className="ti ti-database-plus"></i> Inserir Dados
        </NavLink>
      </nav>

      <div className="sidebar-footer">Sistema V0.1</div>
    </aside>
  );
}