# in-bot: Fullstack Contact Management System

A professional contact registration system with automatic address lookup via ZIP code.

## 🚀 Features

- **User Authentication:** Stateful JWT with persistent sessions.
- **Automated DB Sync:** Prisma automatically synchronizes the database schema on startup (zero-config).
- **Contact CRUD:** Full management of contacts (Create, Read, Update, Delete) scoped by user.
- **Address Auto-complete:** Resilient lookup via ViaCEP with backend caching and circuit breaker.
- **Advanced Filtering:** Instant search by name or email on the dashboard.
- **Responsive UI:** Modern design built with React 19 and CSS Modules.
- **Quality Assurance:** Comprehensive test suite (Vitest + RTL + MSW).
- **Observability:** Structured logging with Pino on the backend.
- **API Documentation:** Interactive Swagger UI.

## 🛠 Tech Stack

- **Backend:** NestJS, Prisma 7, PostgreSQL, Zod.
- **Frontend:** React 19, TypeScript, TanStack Query, Axios.
- **Infrastructure:** Docker, Docker Compose, Nginx.

## 🚦 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd inBot
   ```

2. **Start the environment using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **API (Backend):** [http://localhost:3000](http://localhost:3000)
   - **Swagger Documentation:** [http://localhost:3000/api](http://localhost:3000/api)

## 🧪 Testing

### Backend
```bash
cd back/in-bot
npm install
npm test
```

### Frontend
```bash
cd front/in-bot
npm install
npm test
```

## 🏗 Architecture

The project follows clean architecture principles:
- **Backend:** Layered architecture (Web -> Application -> Domain -> Infrastructure) using CQRS.
- **Frontend:** Feature-based modular structure with atomic UI components.

---

## 📝 1. Raciocínio Técnico (Perguntas Abertas)

### **Idempotência:**
> Como você garante que um usuário não cadastre o mesmo item duas vezes ao clicar rapidamente no botão "Enviar"?

Para garantir a idempotência e evitar duplicidade, utilizo três camadas de proteção:
1. **Front-end (UX):** Desabilito o botão de "Enviar" e exibo um estado de *loading* assim que o primeiro clique é processado, impedindo novos cliques imediatos.
2. **TanStack Query (Mutation State):** Utilizo o estado `isPending` da mutação para controlar a UI, garantindo que o formulário não seja re-submetido enquanto a requisição anterior estiver em voo.
3. **Back-end (Unique Constraints):** No banco de dados, utilizo restrições de unicidade (ex: combinação de `email` + `userId`). Mesmo que uma requisição duplicada passe pelo front-end, o banco de dados rejeitará o registro duplicado, retornando um erro controlado para o usuário.

### **Segurança:**
> Quais são as 3 principais medidas que você toma para proteger uma API Node.js?

1. **Autenticação e Autorização Robusta:** Uso de JWT (Json Web Tokens) com expiração curta e validação rigorosa em cada rota protegida. No back-end, implemento *Guards* para garantir que o usuário só acesse/modifique dados que pertencem a ele (Ownership check).
2. **Sanitização e Validação de Dados:** Uso de bibliotecas como **Zod** para validar rigorosamente o *schema* de entrada antes mesmo de tocar na lógica de negócio, prevenindo injeções e dados malformados.
3. **Proteção de Infraestrutura (Helmet/CORS/Rate Limiting):** Uso do `Helmet` para configurar headers HTTP de segurança, políticas de CORS restritivas para permitir apenas origens confiáveis e `Rate Limiting` para mitigar ataques de força bruta e DoS.

### **Estado no Front-end:**
> Em que situações você prefere usar Context API em vez de apenas passar propriedades (props) entre componentes?

Utilizo a **Context API** para dados que são verdadeiramente "globais" ou transversais à aplicação, onde o *Prop Drilling* (passar props por muitos níveis) tornaria o código frágil e difícil de manter. Situações clássicas incluem:
- **Autenticação:** Status do usuário logado e métodos de login/logout.
- **Tematização:** Preferências de cores (Dark/Light mode).
- **Configurações Globais:** Idioma do sistema ou notificações instantâneas (Toasts).
Para estados de dados do servidor (listas de contatos, etc.), prefiro o **TanStack Query** pela capacidade de cache e sincronização automática.

### **Manutenibilidade:**
> Como você organiza seus arquivos de CSS (puro ou modules) para que eles não fiquem confusos conforme o projeto cresce?

Adoto a estratégia de **CSS Modules** seguindo uma estrutura de componentes. Cada componente React possui seu próprio arquivo `.module.css` na mesma pasta. Isso garante:
1. **Escopo Local:** Evita colisões de nomes de classes, pois o build gera nomes únicos.
2. **Co-location:** O estilo vive junto com a lógica e a estrutura, facilitando a remoção de código morto (se o componente for deletado, o CSS também é).
3. **Variáveis Globais:** Utilizo um arquivo de `global.css` apenas para variáveis de design system (cores, espaçamentos, fontes), garantindo consistência visual sem poluir o escopo global.

---

## 🛠 Decisões Técnicas & Auto-crítica

### Decisões Técnicas
- **CQRS no Back-end:** Escolhi separar os comandos (escrita) das consultas (leitura) para tornar o sistema escalável e facilitar a implementação de lógicas complexas de auditoria no futuro.
- **Resiliência com Circuit Breaker:** Implementei `opossum` na integração com o ViaCEP para que, se o serviço externo cair, o meu sistema não fique travado esperando o timeout, retornando uma resposta amigável imediatamente.
- **Painel Lateral (Drawer) para CRUD:** Optei por um Drawer em vez de modal para manter o contexto visual da lista de contatos enquanto o usuário edita um registro.

### Auto-crítica & Melhorias Futuras
Se tivesse mais tempo, focaria em:
1. **Testes E2E (Playwright):** Implementaria fluxos completos de ponta a ponta simulando o navegador real.
2. **Refresh Token:** Evoluiria o sistema de autenticação para usar *Refresh Tokens* em cookies HTTP-only, aumentando ainda mais a segurança.
3. **Internacionalização (i18n):** Prepararia a interface para múltiplos idiomas.
4. **Exportação de Dados:** Adicionaria a funcionalidade de exportar a lista de contatos em CSV ou PDF.
