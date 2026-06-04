# Implementação: Unit of Work + DDD + Clean Architecture

## ✅ Completado com Sucesso!

### Resumo da Implementação

Implementação completa do padrão **Unit of Work** com arquitetura **DDD** (Domain-Driven Design), **DIP** (Dependency Inversion Principle) e **Clean Architecture**.

---

## 📁 Estrutura de Pastas

```
src/
├── domain/                          # 🎯 Camada de Domínio (Regras de Negócio)
│   ├── shared/
│   │   ├── entities/
│   │   │   └── base.entity.ts      # Classe base para todas as entidades
│   │   ├── value-objects/
│   │   │   ├── email.ts            # Value Object: Email
│   │   │   └── password.ts         # Value Object: Password
│   │   └── repositories/
│   │       ├── repository.interface.ts      # Interface genérica para repositórios
│   │       └── unit-of-work.interface.ts    # Interface do Unit of Work
│   ├── user/
│   │   ├── entities/
│   │   │   └── user.entity.ts      # Entidade User (usuários)
│   │   ├── repositories/
│   │   │   └── user.repository.ts  # IUserRepository (contrato)
│   │   ├── services/
│   │   │   └── user.service.ts     # UserDomainService (lógica de negócio)
│   │   └── DTOs/
│   ├── product/
│   │   ├── entities/
│   │   │   └── product.entity.ts   # Entidade Product (produtos)
│   │   ├── repositories/
│   │   │   └── product.repository.ts # IProductRepository (contrato)
│   │   ├── services/
│   │   │   └── product.service.ts  # ProductDomainService
│   │   └── DTOs/
│   └── order/
│       ├── entities/
│       │   └── order.entity.ts     # Entidade Order (pedidos) + OrderStatus enum
│       ├── repositories/
│       │   └── order.repository.ts # IOrderRepository (contrato)
│       ├── services/
│       │   └── order.service.ts    # OrderDomainService
│       └── DTOs/
│
├── infrastruct/                     # 🔧 Camada de Infraestrutura (Implementações)
│   └── database/
│       ├── config/
│       │   └── data-source.ts      # Configuração TypeORM DataSource
│       ├── repositories/
│       │   ├── user.repository.impl.ts    # UserRepositoryImpl (implementação)
│       │   ├── product.repository.impl.ts # ProductRepositoryImpl
│       │   └── order.repository.impl.ts   # OrderRepositoryImpl
│       ├── unit-of-work/
│       │   └── unit-of-work.ts     # UnitOfWork (implementação completa)
│       └── migrations/
│
├── application/                     # 🎨 Camada de Aplicação
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   └── schemas/
│
├── app.module.ts                    # 🔌 Dependency Injection Configuration
└── main.ts
```

---

## 🎯 Componentes Principais

### 1. **Entidades Base** (`domain/shared/entities/`)
- **BaseEntity**: Classe base fornecendo id (UUID), createdAt, updatedAt

### 2. **Value Objects** (`domain/shared/value-objects/`)
- **Email**: Valida formato de email (regex)
- **Password**: Valida força de senha (min 6 chars, letras + números)

### 3. **Interfaces/Contratos** (`domain/shared/repositories/`)
- **IRepository<T>**: Interface genérica com métodos CRUD padrão
- **IUnitOfWork**: Interface para gerenciar transações

### 4. **Entidades de Domínio**

#### UserEntity (`domain/user/entities/user.entity.ts`)
- Propriedades: id, name, email, password, isActive
- Métodos de domínio: updateInfo(), deactivate(), activate()
- IUserRepository: findByEmail(), emailExists()

#### ProductEntity (`domain/product/entities/product.entity.ts`)
- Propriedades: id, name, description, price, stock, isActive, seller
- Métodos de domínio: updatePrice(), updateStock(), decreaseStock(), increaseStock(), deactivate(), activate()
- IProductRepository: findActive(), findBySellerId(), findByName(), findByPriceRange()

#### OrderEntity (`domain/order/entities/order.entity.ts`)
- Propriedades: id, buyer, products, totalPrice, status, shippingAddress
- OrderStatus: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- Métodos de domínio: addProduct(), removeProduct(), process(), ship(), deliver(), cancel(), calculateTotal()
- IOrderRepository: findByBuyerId(), findByStatus(), findByBuyerIdAndStatus(), findRecent()

### 5. **Domain Services** (Lógica de Negócio)

#### UserDomainService
- createUser(): Valida email duplicado
- getUserByEmail(): Busca usuário ativo
- updateUserInfo(): Atualiza com validações
- deactivateUser()/activateUser(): Gerencia status

#### ProductDomainService
- createProduct(): Valida campos
- updateProductPrice/Stock(): Com validações
- decreaseStock(): Reduz estoque com verificação
- getAvailableProducts(): Lista produtos ativos
- searchByPriceRange(): Busca por preço

#### OrderDomainService
- createOrder(): Cria com validações de produtos
- addProductToOrder()/removeProductFromOrder(): Gerencia items
- processOrder()/shipOrder()/deliverOrder()/cancelOrder(): Máquina de estados
- getBuyerOrders(): Histórico do comprador

### 6. **Unit of Work** (`infrastruct/database/unit-of-work/`)
- **begin()**: Inicia transação
- **commit()**: Confirma mudanças
- **rollback()**: Descarta mudanças
- **execute<T>(work)**: Executa operação atômica com try/catch
- **isTransactionActive()**: Verifica se há transação ativa
- **getQueryRunner()**: Acesso interno ao QueryRunner do TypeORM

### 7. **Repositórios de Infraestrutura** (Implementações)
- **UserRepositoryImpl**: CRUD para UserEntity com TypeORM
- **ProductRepositoryImpl**: CRUD para ProductEntity com buscas avançadas
- **OrderRepositoryImpl**: CRUD para OrderEntity com relacionamentos

### 8. **Dependency Injection** (`app.module.ts`)

```typescript
// Tokens de injeção
export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');
export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
export const ORDER_REPOSITORY_TOKEN = Symbol('IOrderRepository');
export const UNIT_OF_WORK_TOKEN = Symbol('IUnitOfWork');

// Providers registrados
- UnitOfWork (Singleton)
- UserRepositoryImpl (ligado a USER_REPOSITORY_TOKEN)
- ProductRepositoryImpl (ligado a PRODUCT_REPOSITORY_TOKEN)
- OrderRepositoryImpl (ligado a ORDER_REPOSITORY_TOKEN)
- UserDomainService (com injeção de IUserRepository)
- ProductDomainService (com injeção de IProductRepository)
- OrderDomainService (com injeção de IOrderRepository + IProductRepository)
```

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
Controller (aplicação)
    ↓
Application Service (orquestra)
    ↓
Domain Service (regra de negócio)
    ↓
Repository Interface (contrato)
    ↓
Repository Implementation (dados)
    ↓
DataSource + UnitOfWork (transação)
    ↓
PostgreSQL
```

### Princípios Aplicados

✅ **DDD (Domain-Driven Design)**
- Entidades ricas com métodos de domínio
- Value Objects (Email, Password)
- Services encapsulando lógica
- Agregados bem definidos (User, Product, Order)

✅ **DIP (Dependency Inversion)**
- Domain define interfaces
- Infrastructure implementa
- Controllers dependem de abstrações, não concretas
- Injeção de dependência via NestJS

✅ **Clean Architecture**
- Domain não depende de nada
- Infrastructure depende de Domain
- Application depende de Domain
- Regras independentes de frameworks

---

## 📦 Instalações

```bash
npm install @nestjs/typeorm typeorm pg reflect-metadata
```

---

## 🚀 Próximos Passos

1. **Application Services**: Criar serviços de aplicação que orquestram domain services
2. **Controllers**: Implementar endpoints REST usando os application services
3. **Tests**: Adicionar testes unitários para services e repositórios
4. **Migrations**: Criar migrations do TypeORM para o banco de dados
5. **Error Handling**: Adicionar exception filters customizados
6. **Validação**: Integrar class-validator com pipes do NestJS

---

## 💡 Exemplo de Uso (Unit of Work)

```typescript
// Usando Unit of Work com múltiplos repositórios
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN) private unitOfWork: IUnitOfWork,
    @Inject(PRODUCT_REPOSITORY_TOKEN) private productRepo: IProductRepository,
    @Inject(ORDER_REPOSITORY_TOKEN) private orderRepo: IOrderRepository,
  ) {}

  async execute(buyerId: string, productIds: string[]): Promise<OrderEntity> {
    return this.unitOfWork.execute(async () => {
      const products = await Promise.all(
        productIds.map(id => this.productRepo.findById(id))
      );
      
      const order = new OrderEntity({ buyerId, products });
      
      // Todas as operações são atômicas
      for (const product of products) {
        product.decreaseStock(1);
        await this.productRepo.save(product);
      }
      
      return this.orderRepo.save(order);
      // Se qualquer erro ocorrer: rollback automático!
    });
  }
}
```

---

## ✨ Benefícios

- **Transações Atômicas**: UnitOfWork garante que múltiplas operações sejam commitadas juntas
- **Testabilidade**: Interfaces permitem mocks perfeitos
- **Manutenibilidade**: Separação clara de responsabilidades
- **Escalabilidade**: Fácil adicionar novos agregados (ex: Review, Payment)
- **Desacoplamento**: Domain completamente independente de TypeORM
- **Type-Safe**: TypeScript full type support
- **Inversão de Controle**: NestJS DI container gerencia ciclo de vida

---

## 📊 Compilação

```bash
npm run build          # ✅ Compila com sucesso
npm run start:dev      # Inicia em modo desenvolvimento
npm run lint           # Valida código
npm run test           # Roda testes
```

---

## 📝 Notas Importantes

1. **Relações TypeORM**: Usadas strings para evitar circular dependencies
2. **FindOptionsWhere**: Utilizadas para type safety nas queries
3. **Transações**: UnitOfWork cria novo QueryRunner por transação
4. **Domain Services**: Injetam repositórios, não implementações
5. **Value Objects**: Validam automaticamente na construção
6. **Métodos de Domínio**: Encapsulam regras de negócio específicas

---

**Status**: ✅ Implementação Concluída e Compilando com Sucesso!
