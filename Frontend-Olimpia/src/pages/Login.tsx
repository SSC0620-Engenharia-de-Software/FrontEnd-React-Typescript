import { useState, type KeyboardEvent } from 'react';
import { autenticarUsuario, type LoginRequestDTO } from '../services/LoginService';
import './Login.css';

export function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const rules = {
    len: (v: string) => v.length >= 8,
    upper: (v: string) => /[A-Z]/.test(v),
    lower: (v: string) => /[a-z]/.test(v),
    num: (v: string) => /[0-9]/.test(v),
    special: (v: string) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(v),
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Informe sua senha.';
    if (!rules.len(val)) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!rules.upper(val)) return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (!rules.lower(val)) return 'A senha deve conter pelo menos uma letra minúscula.';
    if (!rules.num(val)) return 'A senha deve conter pelo menos um número.';
    if (!rules.special(val)) return 'A senha deve conter pelo menos um caractere especial.';
    return '';
  };

  const handleLogin = async () => {
    const idErr = !identifier.trim() ? 'Informe seu CPF, CNPJ ou e-mail.' : '';
    const pwdErr = validatePassword(password);

    setErrors({ identifier: idErr, password: pwdErr });

    if (!idErr && !pwdErr) {
      try {
        // Chama o serviço de autenticação
        const resultado = await autenticarUsuario({ id: identifier, senha: password });

        if (resultado.categoria === "Invalido") {
          setErrors({ ...errors, identifier: 'Credenciais inválidas.' });
        } else {
          // Aqui você pode salvar o resultado no localStorage ou context
          console.log("Login realizado com sucesso!", resultado);
          alert(`Bem-vindo, ${resultado.categoria}!`);
          
          if (resultado.categoria != "Empresario")
            window.location.href = `/funcionario`;
          else
            window.location.href = `/empresario/${resultado.idEmpresa}`;
        }
      } catch (error) {
        console.error("Erro ao conectar no servidor:", error);
        alert("Erro ao conectar ao servidor. Tente novamente mais tarde.");
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-container" onKeyDown={handleKeyDown}>
      <div className="modal">
        <button className="close-btn" aria-label="Fechar">×</button>
        
        <div className="pane-login">
          <p className="pane-title">Login</p>
          <p className="pane-sub">Informe seus dados para acessar</p>

          <div className="field">
            <label>CPF, CNPJ ou e-mail</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={errors.identifier ? 'invalid' : (identifier ? 'valid' : '')}
            />
            <div className="error-msg">{errors.identifier}</div>
          </div>

          <div className="field">
            <label>Senha</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                onBlur={() => setShowRules(false)}
                className={errors.password ? 'invalid' : (password ? 'valid' : '')}
              />
              <button className="toggle-pwd" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            
            {showRules && (
              <div className="pwd-rules visible">
                <div className={`rule ${rules.len(password) ? 'ok' : ''}`}>Mínimo de 8 caracteres</div>
                <div className={`rule ${rules.upper(password) ? 'ok' : ''}`}>Letra maiúscula</div>
                <div className={`rule ${rules.lower(password) ? 'ok' : ''}`}>Letra minúscula</div>
                <div className={`rule ${rules.num(password) ? 'ok' : ''}`}>Número</div>
                <div className={`rule ${rules.special(password) ? 'ok' : ''}`}>Caractere especial</div>
              </div>
            )}
            <div className="error-msg">{errors.password}</div>
          </div>

          <button className="btn-submit" onClick={handleLogin}>Entrar</button>
        </div>

        {/* Pane de Registro (Mantenha o conteúdo estático como no original) */}
        {/* ── RIGHT: CADASTRO ── */}
        <div className="pane-register">
          <p className="pane-title">Cadastro</p>
          <p className="pane-sub">Faça seu cadastro gratuitamente</p>

          <div className="register-cards">
            {/* Botão Pessoa Jurídica */}
            <button className="reg-card" type="button">
              <div className="reg-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="48" height="44" rx="2" />
                  <rect x="14" y="20" width="8" height="8" fill="#4a4a4a" />
                  <rect x="28" y="20" width="8" height="8" fill="#4a4a4a" />
                  <rect x="42" y="20" width="8" height="8" fill="#4a4a4a" />
                  <rect x="14" y="34" width="8" height="8" fill="#4a4a4a" />
                  <rect x="28" y="34" width="8" height="8" fill="#4a4a4a" />
                  <rect x="42" y="34" width="8" height="8" fill="#4a4a4a" />
                  <rect x="24" y="46" width="16" height="10" fill="#4a4a4a" />
                </svg>
              </div>
              <div className="reg-info">
                <span className="reg-title">Pessoa Jurídica</span>
                <span className="reg-sub">Clique para se cadastrar</span>
              </div>
            </button>

            {/* Botão Pessoa Física */}
            <button className="reg-card" type="button" style={{ background: '#686868' }}>
              <div className="reg-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="14" r="8" />
                  <path d="M16 52c0-8.84 7.16-16 16-16s16 7.16 16 16H16z" />
                  <circle cx="14" cy="20" r="6" opacity=".7" />
                  <path d="M4 52c0-6.63 4.48-12.22 10.6-13.84A13.92 13.92 0 0 0 10 48H4v4z" opacity=".7" />
                  <circle cx="50" cy="20" r="6" opacity=".7" />
                  <path d="M60 52c0-6.63-4.48-12.22-10.6-13.84A13.92 13.92 0 0 1 54 48h6v4z" opacity=".7" />
                </svg>
              </div>
              <div className="reg-info">
                <span className="reg-title">Pessoa Física</span>
                <span className="reg-sub">Clique para se cadastrar</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}