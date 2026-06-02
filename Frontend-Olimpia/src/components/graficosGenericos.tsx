import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ScatterChart,
  Scatter,
} from "recharts";

interface GraficoColunasProps<T extends Record<string, any>> {
  dados: T[];
  chavesX: (keyof T)[];
  chavesSerie: (keyof T)[];
  chaveValor: keyof T;
  //? significa que pode ser nulo
  nomeEixoX?: string;
  nomeEixoY?: string;
  tamanhoFonteX?: string;
  tamanhoFonteY?: string;
}

//Solução temporária, pode precisar mudar de acordo com a quantidade de dados
const cores = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ff6699",
    "#66cc99",
  ];

export function GraficoColunas<T extends Record<string, any>>({
  dados,
  chavesX,
  chavesSerie,
  chaveValor,
  nomeEixoX,
  nomeEixoY,
  tamanhoFonteX,
  tamanhoFonteY,
}: GraficoColunasProps<T>) {
  //Pega todas as chaves em chavesX (valores de X) e junta numa única chave composta
  const montarChave = (
    item: T,
    chaves: (keyof T)[]
  ) => chaves.map((c) => String(item[c])).join(" - ");

  //Separa todas as séries possíveis (possíveis colunas) com as chaves dadas
  //Ex: se as chaves forem ["empresa"], formará ["Empresa A", "Empresa B"]
  //Ex: se as chaves forem ["empresa", "mes"], formará ["Empresa A - janeiro", "Empresa A - fevereiro"]
  const series = [
    ...new Set(
      dados.map((item) => montarChave(item, chavesSerie))
    ),
  ];

  //Separa os dados pela séries dadas
  //Ex: séries ["janeiro", "fevereiro", ...], formarão [{ x: "janeiro", "Empresa A": 10, "Empresa B":20 }, { x: "fevereiro"...}]
  const dadosGrafico = Object.values(
    dados.reduce((acc, item) => {
      //Valor de x atual
      const x = montarChave(item, chavesX);
      //Série atual
      const serie = montarChave(item, chavesSerie);

      //Se ainda não tem nenhum valor pro x atual, cria o objeto inicial
      if (!acc[x]) {
        acc[x] = { x };
      }

      //Salva o valor da série atual no x atual
      //Ou seja, salva o valor da coluna atual no x atual
      acc[x][serie] = item[chaveValor];

      return acc;
    }, 
    //Acumulador inicial, cada chave representa um valor distinto de X
    {} as Record<string, Record<string, any>>)
  );

  return (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={dadosGrafico}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis 
        dataKey="x"
        >
        <Label
          value={nomeEixoX}
          position="insideBottom"
          offset={-5}
          fontSize= { tamanhoFonteX }
        />
      </XAxis>

      <YAxis>
        <Label
          value={nomeEixoY}
          angle={-90}
          position="insideLeft"
          fontSize= { tamanhoFonteY }
        />
      </YAxis>

      <Tooltip />
      <Legend verticalAlign="top" align="right" />

      {series.map((serie, index) => (
        <Bar
          key={serie}
          dataKey={serie}
          name={serie}
          fill={cores[index % cores.length]}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);
}

export function GraficoScatter<T extends Record<string, any>>({
  dados,
  chavesX,
  chavesSerie,
  chaveValor,
  nomeEixoX,
  nomeEixoY,
  tamanhoFonteX,
  tamanhoFonteY,
}: GraficoColunasProps<T>) {
  //Pega todas as chaves em chavesX (valores de X) e junta numa única chave composta
  const montarChave = (
    item: T,
    chaves: (keyof T)[]
  ) => chaves.map((c) => String(item[c])).join(" - ");

  //Separa todas as séries possíveis (possíveis colunas) com as chaves dadas
  //Ex: se as chaves forem ["empresa"], formará ["Empresa A", "Empresa B"]
  //Ex: se as chaves forem ["empresa", "mes"], formará ["Empresa A - janeiro", "Empresa A - fevereiro"]
  const series = [
    ...new Set(
      dados.map((item) => montarChave(item, chavesSerie))
    ),
  ];

  //Separa os dados pela séries dadas
  //Ex: séries ["janeiro", "fevereiro", ...], formarão [{ x: "janeiro", "Empresa A": 10, "Empresa B":20 }, { x: "fevereiro"...}]
  const dadosGrafico = Object.values(
    dados.reduce((acc, item) => {
      //Valor de x atual
      const x = montarChave(item, chavesX);
      //Série atual
      const serie = montarChave(item, chavesSerie);

      //Se ainda não tem nenhum valor pro x atual, cria o objeto inicial
      if (!acc[x]) {
        acc[x] = { x };
      }

      //Salva o valor da série atual no x atual
      //Ou seja, salva o valor da coluna atual no x atual
      acc[x][serie] = item[chaveValor];

      return acc;
    }, 
    //Acumulador inicial, cada chave representa um valor distinto de X
    {} as Record<string, Record<string, any>>)
  );

  return (
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart data={dadosGrafico}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis 
        dataKey="x"
        >
        <Label
          value={nomeEixoX}
          position="insideBottom"
          offset={-5}
          fontSize= { tamanhoFonteX }
        />
      </XAxis>

      <YAxis>
        <Label
          value={nomeEixoY}
          angle={-90}
          position="insideLeft"
          fontSize= { tamanhoFonteY }
        />
      </YAxis>

      <Tooltip />
      <Legend verticalAlign="top" align="right" />

      {series.map((serie, index) => (
        <Scatter
          key={serie}
          dataKey={serie}
          name={serie}
          fill={cores[index % cores.length]}
        />
      ))}
    </ScatterChart>
  </ResponsiveContainer>
);
}