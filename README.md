# Estude Já

Sistema web para gerenciar tarefas e matérias com Next.js e PostgreSQL Neon.

##  Features

-  Listar todas as tarefas com suas matérias
-  Criar novas tarefas com descrição, prazo e matéria
-  Editar tarefas existentes
-  Deletar tarefas
-  Gerenciar matérias
-  Banco de dados PostgreSQL Neon

##  Tech Stack

- **Frontend**: Next.js 16, React 19, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Build Tool**: Turbopack

##  Endpoints da API

### Tasks
- `GET /api/tasks` - Listar todas
- `POST /api/tasks` - Criar nova
- `GET /api/tasks/[id]` - Obter uma
- `PUT /api/tasks/[id]` - Atualizar
- `DELETE /api/tasks/[id]` - Deletar

### Subjects (Matérias)
- `GET /api/subjects` - Listar todas
- `POST /api/subjects` - Criar nova

##  Como Usar

### Instalação

`ash
npm install
`

### Setup do Banco de Dados

`ash
node setup-database.js
`

### Desenvolvimento

`ash
npm run dev
`

Acesse http://localhost:3000

### Build

`ash
npm run build
npm run start
`

##  Banco de Dados

**Tabelas:**
- `materias` (id, nome, created_at)
- `tarefas` (id, titulo, descricao, prazo, materia_id, created_at)

##  Dependências

- next@16.0.10
- react@19.2.1
- react-dom@19.2.1
- pg@8.x (PostgreSQL driver)
