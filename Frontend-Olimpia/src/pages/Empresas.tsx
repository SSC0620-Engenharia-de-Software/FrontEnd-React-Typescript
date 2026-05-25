import { useEffect, useState } from "react";
import { type Empresa, listarEmpresas } from "../services/empresaService";

export function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    listarEmpresas().then(setEmpresas);
  }, []);

  return (
    <div>
      <h1>Empresas</h1>

      <ul>
        {empresas.map((e) => (
          <li key={e.nome}>{e.nome}</li>
        ))}
      </ul>
    </div>
  );
}