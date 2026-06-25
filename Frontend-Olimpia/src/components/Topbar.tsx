import { useState, useEffect } from 'react';

// Avisando o TypeScript sobre as propriedades que este componente recebe
interface TopbarProps {
  userName: string;
}

export function Topbar({ userName }: TopbarProps) {
  // Tipando o estado como string
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const dateStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
    setCurrentDate(dateStr);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-title">
        <span style={{ fontWeight: 500 }}>Bem Vindo</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-date">{currentDate}</span>
        <div className="avatar">{userName.charAt(0)}</div>
      </div>
    </div>
  );
}