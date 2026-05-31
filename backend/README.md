# E-Commerce Backend

Backend de um e-commerce acadêmico desenvolvido com **NestJS** e arquitetura **Domain-Driven Design (DDD)** com padrões de design robustos e altamente testável.

## 📋 Visão Geral

Este é um backend completo para um e-commerce com:
- ✅ Sistema de **autenticação seguro** com JWT
- ✅ Gerenciamento de **usuários e produtos**
- ✅ Gerenciamento de **pedidos**
- ✅ **Value Objects** para validação de domínio
- ✅ **Repository Pattern** para abstração de dados
- ✅ **Use Cases** independentes e testáveis
- ✅ **91+ testes unitários** com cobertura completa
- ✅ **TypeORM** com migrações de banco de dados
- ✅ **Docker** para ambiente padronizado

---

## 🏗️ Arquitetura

Esse projeto implementa **Domain-Driven Design (DDD)** com separação clara de responsabilidades em três camadas:

### 1. **Domain Layer** (Camada de Domínio)
A camada mais importante, contém a lógica de negócio pura:

```
src/domain/
├── shared/
│   ├── value-objects/
│   │   ├── email.ts           # Email VO com validação RFC 5322
│   │   └── password.ts        # Password VO com bcrypt integration
│   └── repositories/
│       └── unit-of-work.interface.ts
├── user/
│   ├── entities/
│   │   └── user.entity.ts     # User entity com domínio methods
│   ├── repositories/
│   │   └── user.repository.ts # Interface IUserRepository
│   ├── services/
│   │   └── user.service.ts    # User domain service
│   └── value-objects/
├── auth/
│   ├── entities/
│   │   └── login-session.entity.ts # LoginSession com 12+ domain methods
│   ├── value-objects/
│   │   └── refresh-token.ts   # RefreshToken VO com crypto-secure generation
│   ├── repositories/
│   │   └── auth.repository.ts # Interface IAuthRepository (11 métodos)
│   └── types/
│       └── auth.types.ts      # JwtPayload, TokenPair, AuthContext, etc
├── product/
│   ├── entities/
│   ├── repositories/
│   └── services/
└── order/
    ├── entities/
    ├── repositories/
    └── services/
```

#### **Value Objects (VOs)**

Um **Value Object** é um objeto imutável que representa um conceito de domínio com identidade definida por seus atributos:

**Email VO:**
```typescript
const email = Email.create('user@example.com');
// Valida: RFC 5322 simplified pattern
// Normaliza: lowercase + trim
// Expõe: getters para localPart e domain
```

**Password VO:**
```typescript
const password = Password.create('SecurePass123!');
// Valida: 8-128 chars, uppercase, lowercase, number, special char
// Hasheia com bcrypt automaticamente
// Método compare() para validação de senha

// Ao carregar do DB:
const loaded = Password.createFromHash(hashedPassword);
```

**RefreshToken VO:**
```typescript
const token = RefreshToken.create(7); // 7 dias de expiração
// Gera: crypto.randomBytes(32).toString('hex') - 64 caracteres
// Valida: isExpired(), isValid(), isExpiringSoon()
// Imutável: retorna cópias de datas
```

#### **Entities**

Uma **Entity** tem identidade única e ciclo de vida. Contém lógica de domínio (não apenas dados):

**LoginSessionEntity:**
```typescript
class LoginSessionEntity {
  id: string;
  userId: string;
  accessToken: string;
  refreshTokenValue: string;
  isActive: boolean;
  createdAt: Date;
  
  // Domain Methods (lógica de negócio)
  isExpired(): boolean
  isRefreshTokenValid(): boolean
  renewAccessToken(token: string, expiresAt: Date): void
  revoke(): void
  isRecent(minutes: number): boolean
  getTimeRemaining(): number
}
```

### 2. **Application Layer** (Camada de Aplicação)
Coordena a execução dos casos de uso:

```
src/application/
├── services/ (Use Cases)
│   ├── login.use-case.ts           # Autentica usuário, cria sessão
│   ├── refresh-token.use-case.ts   # Renova access token
│   └── logout.use-case.ts          # Revoga sessão
├── dtos/
│   ├── auth/
│   │   ├── auth-requests.dto.ts    # LoginRequestDto, RefreshTokenRequestDto
│   │   └── auth-responses.dto.ts   # LoginResponseDto, UserAuthDto (sem senha!)
│   └── user/
│       └── ...
├── mappers/
│   └── auth.mapper.ts              # Entity → DTO (conversão segura)
├── guards/
│   └── jwt-auth.guard.ts           # Valida JWT, extrai user context
├── decorators/
│   └── current-user.decorator.ts   # @CurrentUser() extrai usuário
├── controllers/
│   ├── auth.controller.ts          # 5 endpoints: register, login, refresh-token, logout, me
│   ├── user.controller.ts
│   ├── product.controller.ts
│   └── order.controller.ts
├── di/
│   └── tokens.ts                   # DI tokens constantes
└── auth.module.ts                  # AuthModule com providers
```

#### **Use Cases (Application Services)**

Um **Use Case** implementa uma ação específica de negócio em um contexto isolado:

**LoginUseCase:**
```typescript
@Injectable()
export class LoginUseCase {
  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    // 1. Valida email como VO
    const email = Email.create(input.email);
    
    // 2. Busca usuário no repositório
    const user = await this.userDomainService.getUserByEmail(email);
    
    // 3. Compara senha usando VO
    const passwordVO = Password.createFromHash(user.password);
    const matches = await passwordVO.compare(input.password);
    
    // 4. Gera JWT token
    const accessToken = this.jwtService.sign(jwtPayload);
    
    // 5. Cria LoginSessionEntity
    const session = LoginSessionEntity.create({...});
    
    // 6. Persiste em transação
    await this.authRepository.saveSession(session);
    
    return { session, accessToken };
  }
}
```

#### **DTOs (Data Transfer Objects)**

DTOs validam entrada/saída e **nunca expõem dados sensíveis**:

```typescript
// Entrada (com validação de classe)
export class LoginRequestDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}

// Saída (nunca expõe senha)
export class UserAuthDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  // ❌ password: string; // Nunca!
}
```

### 3. **Infrastructure Layer** (Camada de Infraestrutura)
Implementação concreta de abstrações do domínio:

```
src/infrastruct/
├── database/
│   ├── config/
│   │   └── data-source.ts          # TypeORM config + conexão
│   ├── migrations/
│   │   ├── 20260523144000-InitialSchema.ts
│   │   └── 20260530143000-CreateLoginSessionTable.ts
│   ├── repositories/
│   │   ├── auth.repository.impl.ts # Implementa IAuthRepository com TypeORM
│   │   ├── user.repository.impl.ts
│   │   ├── product.repository.impl.ts
│   │   └── order.repository.impl.ts
│   └── unit-of-work/
│       └── unit-of-work.ts         # Transações ACID
└── ...
```

#### **Repository Pattern**

O **Repository** abstrai o acesso a dados:

```typescript
// Domínio define o contrato
export interface IAuthRepository {
  saveSession(session: LoginSessionEntity): Promise<LoginSessionEntity>;
  findByRefreshToken(token: string): Promise<LoginSessionEntity | null>;
  updateSession(session: LoginSessionEntity): Promise<LoginSessionEntity>;
  revokeAllUserSessions(userId: string): Promise<number>;
  deleteExpiredSessions(): Promise<number>;
  // ... 6 métodos adicionais
}

// Infraestrutura implementa com TypeORM
@Injectable()
export class AuthRepositoryImpl implements IAuthRepository {
  async saveSession(session: LoginSessionEntity): Promise<LoginSessionEntity> {
    return this.dataSource.getRepository(LoginSessionEntity).save(session);
  }
  
  async findByRefreshToken(token: string): Promise<LoginSessionEntity | null> {
    return this.dataSource
      .getRepository(LoginSessionEntity)
      .findOne({ where: { refreshTokenValue: token, isActive: true } });
  }
}
```

---

## 🎯 Design Patterns Utilizados

### 1. **Domain-Driven Design (DDD)**
- Entidades e Value Objects como centros da arquitetura
- Linguagem Ubíqua (domínio language compartilhado)
- Separação clara de responsabilidades por camada

### 2. **Repository Pattern**
- Abstração de persistência
- Facilita testes (mocks) e mudança de banco de dados

### 3. **Dependency Injection (DI)**
- NestJS nativamente suporta via decoradores `@Injectable()` e `@Inject()`
- Injeção de tokens constantes para evitar strings mágicas

### 4. **Value Objects**
- Imutabilidade
- Validação no construtor
- Igualdade por valor (não por referência)

### 5. **Unit of Work Pattern**
- Transações ACID
- Rollback automático em caso de erro

### 6. **Use Cases (Application Services)**
- Cada caso de uso isolado
- Fácil de testar e raciocinar
- Segue princípio Single Responsibility

### 7. **DTO Pattern**
- Validação de entrada com decoradores
- Serialização controlada de saída
- Proteção contra over-posting

### 8. **Guards & Decorators**
- `JwtAuthGuard`: Valida token e extrai contexto
- `@CurrentUser()`: Acesso seguro ao usuário autenticado

### 9. **Data Mapper (AuthMapper)**
- Converte Entity → DTO
- Garante que nunca dados sensíveis vazem
- Lógica de transformação centralizada

---

## 🔐 Sistema de Autenticação

### Fluxo de Login

```
1. POST /auth/login
   ├── Email validado como VO (RFC 5322)
   ├── Usuário buscado no repositório
   ├── Senha validada com Password VO (bcrypt compare)
   ├── JWT gerado (15 min)
   ├── RefreshToken gerado (7 dias)
   ├── LoginSessionEntity criada e persistida
   └── Response: { accessToken, refreshToken, expiresIn, user }

2. POST /auth/refresh-token
   ├── RefreshToken validado
   ├── Novo AccessToken gerado
   └── Response: { accessToken, expiresIn }

3. GET /auth/me [PROTECTED]
   ├── JwtAuthGuard valida token
   ├── @CurrentUser() extrai contexto
   └── Response: { userId, email }

4. POST /auth/logout [PROTECTED]
   ├── Todas as sessões do usuário são revogadas
   └── Response: { message: 'Logout realizado' }
```

### Segurança

- ✅ Senhas hasheadas com **bcrypt** (não reversível)
- ✅ **JWT com expiração** (access: 15min, refresh: 7d)
- ✅ **RefreshToken** com geração cryptographically secure
- ✅ **Soft delete** com flag `isActive`
- ✅ **Proteção contra CSRF**: CORS configurado
- ✅ **DTOs nunca expõem senha**: UserAuthDto sem password field
- ✅ **Rate limiting**: Pode ser adicionado via NestJS throttler
- ✅ **SQL Injection protegido**: TypeORM com parameterized queries

---

## 📦 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(120) NOT NULL,
  email varchar UNIQUE NOT NULL,
  password varchar NOT NULL,
  isActive boolean DEFAULT true,
  createdAt timestamp DEFAULT now(),
  updatedAt timestamp DEFAULT now()
);
```

### LoginSessions Table
```sql
CREATE TABLE login_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId uuid NOT NULL FK → users,
  accessToken varchar NOT NULL,
  accessTokenExpiresAt timestamp NOT NULL,
  refreshTokenValue varchar UNIQUE NOT NULL,
  refreshTokenExpiresAt timestamp NOT NULL,
  refreshTokenCreatedAt timestamp NOT NULL,
  ipAddress varchar,
  userAgent varchar,
  isActive boolean DEFAULT true,
  createdAt timestamp DEFAULT now(),
  updatedAt timestamp DEFAULT now()
);

-- Índices para performance
CREATE INDEX IDX_login_sessions_userId_isActive 
  ON login_sessions(userId, isActive);
CREATE UNIQUE INDEX IDX_login_sessions_refreshTokenValue 
  ON login_sessions(refreshTokenValue);
CREATE INDEX IDX_login_sessions_accessTokenExpiresAt 
  ON login_sessions(accessTokenExpiresAt);
CREATE INDEX IDX_login_sessions_refreshTokenExpiresAt 
  ON login_sessions(refreshTokenExpiresAt);
```

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js >= 18
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/joaoMiraya/ecommerce-unimar.git
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do banco de dados

# 4. Executar migrações
npm run typeorm migration:run

# 5. Iniciar servidor em desenvolvimento
npm run start:dev
```

### Variáveis de Ambiente

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ecommerce

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h

# Environment
NODE_ENV=development
```

---

## 📝 API Endpoints

### Autenticação

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "phone": "(11) 98765-4321"
}

Response: 201 Created
{
  "status": 201,
  "data": {
    "message": "Usuário criado com sucesso"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "expiresIn": 900,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@example.com",
    "name": "João Silva",
    "createdAt": "2026-05-30T14:30:00Z",
    "isActive": true
  }
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

#### Logout (Protected)
```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "status": 200,
  "data": {
    "message": "Logout realizado com sucesso"
  }
}
```

#### Get Profile (Protected)
```http
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "status": 200,
  "data": {
    "message": "Perfil do usuário",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### Health Check
```http
GET /health

Response: 200 OK
{
  "status": "ok",
  "timestamp": "2026-05-30T14:30:00Z"
}
```

---

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm run test

# Com cobertura
npm run test:cov

# Em modo watch (reexecuta ao salvar)
npm run test:watch

# Testes E2E
npm run test:e2e
```

### Cobertura Atual
```
Test Suites: 6 passed
Tests:       91 passed
Coverage:    ✅ VOs, Entity, Repository, Use Cases
```

### Exemplos de Testes

**Email VO:**
```typescript
describe('Email Value Object', () => {
  it('should create valid email', () => {
    const email = Email.create('user@example.com');
    expect(email.value).toBe('user@example.com');
  });

  it('should validate RFC 5322 format', () => {
    expect(() => Email.create('invalid-email')).toThrow();
  });

  it('should normalize to lowercase', () => {
    const email = Email.create('USER@EXAMPLE.COM');
    expect(email.value).toBe('user@example.com');
  });
});
```

**LoginUseCase:**
```typescript
describe('LoginUseCase', () => {
  it('should authenticate user and return tokens', async () => {
    const result = await loginUseCase.execute({
      email: 'user@example.com',
      password: 'SecurePass123!',
    });
    
    expect(result.accessToken).toBeDefined();
    expect(result.session).toBeDefined();
    expect(result.session.userId).toBe(user.id);
  });

  it('should throw on invalid credentials', async () => {
    await expect(
      loginUseCase.execute({
        email: 'user@example.com',
        password: 'WrongPassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});
```

---

## 📂 Estrutura de Pastas

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── app.service.ts             # Global service
│   ├── domain/                    # 🎯 Domain Layer (Lógica de negócio pura)
│   │   ├── shared/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   └── order/
│   ├── application/               # 📦 Application Layer (Coordenação)
│   │   ├── services/              # Use cases
│   │   ├── controllers/           # HTTP endpoints
│   │   ├── dtos/                  # Data transfer objects
│   │   ├── guards/                # Auth guards
│   │   ├── decorators/            # Custom decorators
│   │   ├── mappers/               # Entity → DTO conversion
│   │   ├── middlewares/           # HTTP middlewares
│   │   ├── di/                    # DI tokens
│   │   └── auth.module.ts         # Auth module
│   └── infrastruct/               # 🔧 Infrastructure Layer
│       └── database/
│           ├── config/
│           ├── migrations/
│           ├── repositories/
│           └── unit-of-work/
├── test/                          # E2E tests
├── dist/                          # Compilado (gerado)
├── node_modules/                  # Dependências
├── .env                           # Variáveis de ambiente
├── .env.example                   # Exemplo de .env
├── tsconfig.json                  # TypeScript config
├── jest.config.js                 # Jest config
├── package.json
└── README.md
```

---

## 🔄 Ciclo de Vida de Uma Request

```
1. HTTP Request → Controller
   ↓
2. DTO Validation (class-validator)
   ├─ Se inválido: 400 Bad Request
   └─ Se válido: continua
   ↓
3. Guard (JwtAuthGuard se protegido)
   ├─ Se não autenticado: 401 Unauthorized
   └─ Se válido: extrai @CurrentUser()
   ↓
4. Use Case (ex: LoginUseCase)
   ├─ Value Objects criados/validados
   ├─ Repositórios consultados
   ├─ Domínio methods executados
   └─ Entidades persistidas via Unit of Work
   ↓
5. Mapper: Entity → DTO
   └─ Remove dados sensíveis
   ↓
6. HTTP Response (200, 201, 400, 401, 500)
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev          # Iniciar em watch mode
npm run start:debug        # Debug com inspector

# Build
npm run build              # Build para produção

# Produção
npm run start:prod         # Executar compilado

# Linting e formatação
npm run lint               # ESLint
npm run format             # Prettier

# Testes
npm run test               # Rodar testes
npm run test:watch        # Watch mode
npm run test:cov          # Com coverage
npm run test:e2e          # E2E tests

# Database
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
npm run typeorm migration:revert
```

---

## 📚 Referências e Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [TypeORM Documentation](https://typeorm.io)
- [JWT.io](https://jwt.io)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- ✅ Use **Value Objects** para conceitos de domínio
- ✅ Valide dados **no construtor** (fail fast)
- ✅ Implemente **testes unitários** para novas features
- ✅ Siga o padrão **Use Case** para novas ações
- ✅ Nunca exponha **dados sensíveis** em DTOs
- ✅ Use **DTOs para validação** de entrada
- ✅ Mantenha **repositórios abstratos** de persistência

---

## 📄 Licença

Este projeto está licenciado sob a License UNLICENSED - veja o arquivo LICENSE para detalhes.

---

## ✨ Autor

Desenvolvido como projeto acadêmico pelo João Miraya para a disciplina de Engenharia de Software.

**Últimas mudanças:** Maio 2026 - Implementação completa do módulo de autenticação com DDD.
