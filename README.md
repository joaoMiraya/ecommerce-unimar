# E-Commerce Unimar

Monorepo com frontend (React/Vite), backend (NestJS) e banco PostgreSQL, orquestrados por Docker Compose.

## Subindo com Docker Compose

### 1. Pré-requisitos

- Docker
- Docker Compose (plugin `docker compose`)

### 2. Configurar variáveis de ambiente

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

> Os serviços no `docker-compose.yml` usam essas configurações para backend e banco.  
> No frontend em container, o `VITE_API_URL` é injetado no build da imagem.

### 3. Subir os containers

```bash
docker compose up --build -d
```

### 4. Verificar status

```bash
docker compose ps
docker compose logs -f
```

### Aplicar as migrations
```bash
docker compose exec backend sh
npm run db:migrate:docker
```

### 5. Endpoints locais

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Health backend: http://localhost:8000/api/health
- PostgreSQL: `localhost:5432`

### 6. Parar os serviços

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

## Serviços definidos no docker-compose

- `postgres`: banco PostgreSQL com volume persistente `db-data`
- `backend`: API NestJS na porta `8000`
- `frontend`: app React servido por Nginx na porta `3000`

O Compose já está configurado com:
- rede interna `app-network`
- healthchecks para `postgres`, `backend` e `frontend`
- ordem de dependência para subir frontend somente após backend saudável

## Documentação específica por módulo

Para detalhes de endpoints, arquitetura e fluxos internos, consulte:

- **Backend:** [`backend/README.md`](./backend/README.md)
- **Frontend:** [`frontend/README.md`](./frontend/README.md)
