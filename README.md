# Repositório Frontend React + TypeScript

Repositório responsável por:

- aplicação frontend em React + TypeScript
- build e execução via Docker
- consumo de API ASP.NET externa
- configuração de ambientes (.env)
- servir aplicação via Nginx

---

# Estrutura do Projeto

```text
project-root/
│
├── Dockerfile
├── docker-compose.yaml
├── .dockerignore
│
├── Frontend-Olimpia/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   ├── public/
│   ├── .env.development
│   ├── .env.docker
│   └── .env.production
│
└── dist/ (gerado automaticamente)
```

---

# Descrição dos Arquivos
## Frontend-Olimpia

Contém a aplicação React principal.

Responsável por:

- lógica do frontend
- páginas e componentes
- chamadas HTTP para API ASP.NET
- configuração do Vite
- variáveis de ambiente

## .env.local

Usado no desenvolvimento local.

## .env.docker

Usado quando o projeto é buildado para Docker.

# Configuração Docker

## Dockerfile

Responsável por:

- build da aplicação React
- geração dos arquivos estáticos
- execução via Nginx

```Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY Frontend-Olimpia/package*.json ./
RUN npm install

COPY Frontend-Olimpia/ .

RUN npm run build -- --mode docker


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## docker-compose.yaml

Responsável por:

- build da imagem do frontend
- execução do container
- exposição da aplicação no navegador

# Configuração do Axios

O frontend utiliza Axios para comunicação com a API.

Exemplo:
```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

# Executando o projeto

## Build e execução via Docker
```bash
docker compose up --build
```

## Build e execução em máquina local

```bash
npm install
npm run dev
```

# Mapeamento de portas

O Nginx roda sempre na porta 80.

| Origem | Destino |
|---|---|
| localhost:3000 | container Nginx:80 |

# Observações Importantes

## 1. Build do React é obrigatório no Docker

O Docker não executa React em modo dev.

Ele gera arquivos estáticos via:

```Bash
npm run build
```

## 2. Vite usa variáveis com prefixo obrigatório

Somente variáveis com:

```typescript
VITE_
```

são expostas ao frontend.

## 3. CORS depende do backend

O backend ASP.NET deve permitir o domínio:

```bash
http://localhost:3000
```

ou equivalente em produção.