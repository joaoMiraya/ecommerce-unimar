# Frontend - Rotas e páginas

Este frontend usa **React + React Router** com rotas públicas e privadas.  
As rotas privadas são protegidas por `PrivateRoute` (`src/routes/route.private.tsx`) e redirecionam para `/login` quando o usuário não está autenticado.

## Mapa de rotas

| Rota | Página/Componente | Acesso | Descrição |
| --- | --- | --- | --- |
| `/` | `Home` (`src/pages/Home.tsx`) | Público | Lista de produtos com filtros e paginação (`ProductList`). |
| `/login` | `Login` (`src/pages/Login.tsx`) | Público | Tela de autenticação com `LoginForm`. |
| `/register` | `Register` (`src/pages/Register.tsx`) | Público | Tela de cadastro com `RegisterForm`. |
| `/cart` | `Cart` (`src/pages/Cart.tsx`) | Público | Carrinho de compras e finalização de pedido. |
| `/profile` | `Profile` (`src/pages/Profile.tsx`) | Privado | Perfil do usuário (`ProfileComponent`). |
| `/products` | `Products` (`src/pages/Products.tsx`) | Privado | Gestão de produtos próprios (criação + listagem paginada). |
| `/orders` | `Orders` (`src/pages/Orders.tsx`) | Privado | Lista de pedidos do usuário comprador. |
| `/sales` | `Sales` (`src/pages/Sales.tsx`) | Privado | Lista de vendas do vendedor e atualização de status. |
| `*` | `NotFound` (`src/pages/NotFound.tsx`) | Público | Fallback para rotas inexistentes. |

## Páginas existentes no projeto

As páginas em `src/pages` atualmente são:

- `Home.tsx`
- `Login.tsx`
- `Register.tsx`
- `Cart.tsx`
- `Profile.tsx`
- `Products.tsx`
- `Orders.tsx`
- `Sales.tsx`
- `NotFound.tsx`

## Observações de navegação/autenticação

- O bootstrap das rotas está em `src/routes/main.tsx`.
- Ao iniciar o app, o frontend tenta `POST /auth/refresh` para restaurar sessão.
- Se a sessão não for restaurada, o usuário é deslogado e as rotas privadas exigem login.