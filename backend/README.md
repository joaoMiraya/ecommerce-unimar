# E-Commerce Backend

Backend do e-commerce acadêmico com **NestJS**, **TypeORM** e arquitetura em camadas (**Domain / Application / Infrastructure**).

## Stack principal

- NestJS 11
- TypeORM + PostgreSQL
- JWT (access token) + refresh token em cookie HttpOnly
- class-validator/class-transformer para validação de DTOs

## Como rodar

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run start:dev
```

### Migrações em container Docker

No container de produção do backend, `ts-node` não é instalado (somente dependências de produção).  
Por isso, use os scripts baseados em `dist`:

```bash
npm run db:migrate:docker
npm run db:migrate:revert:docker
```

Servidor padrão: `http://localhost:8000`  
Prefixo global da API: `/api`

## Variáveis de ambiente

Baseado em `backend/.env.example`:

```env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=ecommerce_user
POSTGRES_PASSWORD=passwd
POSTGRES_NAME=ecommerce_db
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=3600s
PORT=8000
FRONTEND_URL=http://localhost:5173
```

## Rotas da API (estado atual)

> Todas as rotas abaixo usam prefixo `/api`.

### Health

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| GET | `/health` | Não | Health check da aplicação |

### Auth

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/register` | Não | Registra usuário e já autentica |
| POST | `/auth/login` | Não | Login e retorno de access token |
| POST | `/auth/refresh` | Não | Renova sessão via cookie `refresh_token` |
| POST | `/auth/logout` | Sim | Invalida sessão do usuário logado |
| GET | `/auth/profile` | Sim | Retorna perfil do usuário autenticado |

### Users

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| PUT | `/users` | Sim | Atualiza nome e email do usuário |
| DELETE | `/users` | Sim | Desativa conta e faz logout |
| POST | `/users/address` | Sim | Cria endereço para o usuário |
| PUT | `/users/address` | Sim | Atualiza endereço existente |

### Products

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| POST | `/products` | Sim | Cria produto |
| GET | `/products` | Não | Lista produtos com filtros e paginação |
| GET | `/products/own` | Sim | Lista produtos do usuário logado com paginação |
| DELETE | `/products` | Sim | Desativa produto do próprio usuário |

#### Query params de produtos

- `name` (string)
- `seller` (string)
- `min_price` (number)
- `max_price` (number)
- `page` (number, mínimo 1)
- `limit` (number, mínimo 1)

**Mudança atual:** `GET /products/own` agora também recebe e aplica `page`/`limit` (e demais filtros válidos), além de forçar `sellerId` pelo usuário autenticado.

### Orders

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| POST | `/orders` | Sim | Cria pedido |
| GET | `/orders` | Sim | Lista pedidos do comprador logado |
| GET | `/orders/sales` | Sim | Lista vendas do vendedor logado |
| POST | `/orders/cancel` | Sim | Cancela pedido |
| POST | `/orders/status` | Sim | Atualiza status do pedido |

`status` aceito em atualização: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

## Estrutura (resumo)

```text
src/
├── domain/          # Regras de negócio e entidades
├── application/     # Controllers, DTOs, use cases, guards
└── infrastruct/     # TypeORM, repositórios, UnitOfWork, migrações
```

## Scripts úteis

```bash
# Desenvolvimento
npm run start:dev
npm run start:debug

# Build
npm run build
npm run start:prod

# Qualidade
npm run lint
npm run format

# Testes
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

# Banco
npm run db:migrate
npm run db:migrate:revert
npm run db:migrate:create -- <nome-da-migration>
npm run db:migrate:docker
npm run db:migrate:revert:docker
```
