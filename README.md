# Hodos

> _"Eu sou o caminho, a verdade e a vida."_ — João 14:6

**Hodos** é uma plataforma web gamificada de estudo bíblico, inspirada na dinâmica do Duolingo. Os jovens avançam por trilhas temáticas e cronológicas, respondem perguntas de múltipla escolha, mantêm ofensivas diárias e competem em ligas — tudo isso aprendendo a Palavra.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-amber) ![licença](https://img.shields.io/badge/licença-MIT-blue) ![stack](https://img.shields.io/badge/stack-Next.js%20%2B%20Supabase-purple)

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Jogo](#estrutura-do-jogo)
3. [Gamificação](#gamificação)
4. [Sistema de Perfis](#sistema-de-perfis)
5. [Stack Técnica](#stack-técnica)
6. [Como Rodar Localmente](#como-rodar-localmente)
7. [Estrutura do Repositório](#estrutura-do-repositório)
8. [Fluxo de Git e Branches](#fluxo-de-git-e-branches)
9. [Deploy](#deploy)
10. [Roadmap](#roadmap)
11. [Contribuindo](#contribuindo)
12. [Licença](#licença)

---

## Visão Geral

O **Hodos** transforma o estudo bíblico em uma jornada visual e contínua. A motivação é simples: jovens passam horas no Duolingo, TikTok e jogos casuais por causa de mecânicas bem desenhadas. O que aconteceria se a mesma engenharia de engajamento fosse aplicada ao conteúdo bíblico?

**Público-alvo:** jovens de 12 a 25 anos, com qualquer nível de familiaridade com a Bíblia.

**Princípio pedagógico:** repetição espaçada + recompensa + competição saudável + comunidade.

---

## Estrutura do Jogo

O conteúdo está organizado em **Mundos → Lições → Perguntas**.

### Linha Principal (Cronológica)

| Ordem | Mundo                          | Cobertura                              |
| ----- | ------------------------------ | -------------------------------------- |
| 1     | Origens                        | Gênesis e Êxodo                        |
| 2     | Conquista e Juízes             | Josué a Rute                           |
| 3     | Reis e Profetas                | Samuel a Malaquias                     |
| 4     | Sabedoria e Poesia             | Jó, Salmos, Provérbios, Eclesiastes    |
| 5     | Vida de Jesus                  | Os 4 Evangelhos                        |
| 6     | Igreja Primitiva               | Atos                                   |
| 7     | Cartas Apostólicas             | Romanos a Judas                        |
| 8     | Apocalipse                     | Apocalipse                             |

### Trilhas Temáticas (paralelas)

- Heróis da Fé
- Parábolas de Jesus
- Milagres da Bíblia
- Profecias Messiânicas
- Mulheres da Bíblia
- Geografia Bíblica

Cada lição contém de 8 a 12 perguntas, misturando múltipla escolha, completar versículo, ordenar eventos e associação.

O banco inicial está em [`data/perguntas_iniciais.json`](./data/perguntas_iniciais.json) — 45 perguntas distribuídas em 4 mundos como ponto de partida.

---

## Gamificação

| Mecânica          | Descrição                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| **Ofensiva**      | Sequência de dias estudando. Marcos comemorativos em 7, 30, 100 e 365 dias. 1 "freezer" semanal automático |
| **Lâmpadas**      | 5 lâmpadas de óleo (vidas). Perde 1 por erro, recupera com o tempo (Mateus 25)                             |
| **XP & Níveis**   | Pontos por lição, multiplicador por ofensiva ativa                                                         |
| **Ligas**         | Cordeiro → Pomba → Águia → Leão → Querubim. Ranking semanal entre 30 jogadores                             |
| **Emblemas**      | Coração de Davi, Sabedoria de Salomão, Fidelidade de Rute, Zelo de Paulo, Fé de Abraão...                  |
| **Manná Diário** | Desafio rápido (3 perguntas) com versículo para meditar                                                    |
| **Duelos**        | Modo multiplayer 1×1 em tempo real                                                                         |

---

## Sistema de Perfis

### Autenticação

Três opções gerenciadas pelo Supabase Auth:

1. **Google OAuth** (recomendado para jovens — 1 clique)
2. **Magic Link por e-mail** (sem senha)
3. **E-mail + senha** (tradicional)

### Cadastro em 2 Etapas

**Etapa 1 — Obrigatório:** nome de exibição, e-mail, data de nascimento.

**Etapa 2 — Opcional (com bônus de XP):** avatar, igreja/grupo, versículo favorito, livro favorito, motivação inicial.

### Conformidade com a LGPD

- Menores de 12 anos: consentimento parental obrigatório (e-mail do responsável)
- Coleta mínima: sem CPF, endereço ou telefone
- Botão "Excluir minha conta" (apaga dados em até 30 dias)
- Botão "Baixar meus dados" (exporta tudo em JSON)
- Política de privacidade em linguagem simples

### Funcionalidades de Perfil

- **Histórico visual** das conquistas em linha do tempo
- **Estatísticas:** gráfico por mundo, taxa de acerto por dificuldade, tempo total
- **Modo revisão:** lista de perguntas erradas para refazer
- **Compartilhar perfil:** link público `hodos.app/p/usuario`
- **Modo Líder de Jovens:** conta especial que acompanha um grupo, com consentimento explícito

### Segurança

- Hash bcrypt automático no Supabase
- **Row Level Security (RLS)** ativa em todas as tabelas
- 2FA opcional no perfil
- Rate limiting: 5 tentativas de login → bloqueio de 15min
- Variáveis sensíveis em `.env.local`, **nunca** commitadas
- HTTPS obrigatório (Vercel padrão)

---

## Stack Técnica

### Front-end

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animações dos mapas e transições
- **Zustand** — estado global leve
- **Lucide Icons**

### Back-end

- **Supabase** — PostgreSQL + Auth + Storage + Realtime
- **Row Level Security (RLS)** — segurança a nível de linha

### Ferramentas

- **ESLint + Prettier** — padronização
- **Vitest** — testes unitários
- **Husky + lint-staged** — pre-commit hooks
- **GitHub Actions** — CI/CD

### Modelo de Dados (Resumo)

```
profiles ─── user_settings
   │
   ├──── user_progress ──── lessons ──── worlds
   │                            │
   │                            └──── questions ──── alternatives
   │
   ├──── user_answer_history
   ├──── user_badges ──── badges
   └──── friendships
```

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- pnpm (recomendado) ou npm
- Conta gratuita no [Supabase](https://supabase.com)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO/hodos.git
cd hodos

# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas chaves do Supabase

# Rodar migrations do banco
pnpm supabase db push

# Importar perguntas iniciais
pnpm seed

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`.

### Variáveis de Ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key  # apenas servidor
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Estrutura do Repositório

```
hodos/
├── .github/
│   └── workflows/
│       ├── ci.yml              # lint + testes em cada PR
│       └── deploy.yml          # deploy automático em main
├── public/
│   ├── avatars/                # avatares padrão
│   └── icons/                  # mascote, logos
├── src/
│   ├── app/                    # rotas Next.js
│   │   ├── (auth)/             # login, cadastro
│   │   ├── (game)/             # mapa, lição, ranking
│   │   ├── perfil/             # perfil do usuário
│   │   └── api/                # endpoints
│   ├── components/             # UI reutilizável
│   │   ├── ui/                 # botões, cards, inputs
│   │   ├── game/               # MapaProgressao, NoLicao
│   │   └── perfil/             # CardEmblema, GraficoXP
│   ├── lib/
│   │   ├── supabase/           # cliente, helpers
│   │   ├── gamificacao/        # cálculo XP, ligas, emblemas
│   │   └── validacao/
│   ├── features/
│   │   ├── quiz/
│   │   ├── ofensiva/
│   │   └── ranking/
│   └── stores/                 # Zustand stores
├── data/
│   └── perguntas_iniciais.json # banco inicial (seed)
├── supabase/
│   ├── migrations/             # versionamento do schema
│   └── seed.sql
├── scripts/
│   └── seed-perguntas.ts       # importa o JSON no banco
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Fluxo de Git e Branches

### Branches Principais

- **`main`** — produção. Sempre estável. Deploy automático.
- **`develop`** — integração. Onde features novas se encontram antes de ir pra produção.

### Branches de Trabalho

- **`feature/nome-curto`** — nova funcionalidade
- **`fix/nome-do-bug`** — correção
- **`hotfix/...`** — emergência em produção
- **`docs/...`** — apenas documentação

### Fluxo Padrão

```bash
# Criar branch a partir de develop
git checkout develop
git pull
git checkout -b feature/sistema-de-ligas

# ... trabalha, commita ...

# Subir e abrir Pull Request
git push -u origin feature/sistema-de-ligas
# Abra um PR de feature/sistema-de-ligas → develop no GitHub

# Após revisão e aprovação, faça merge.
# Periodicamente, develop → main para liberar em produção.
```

### Conventional Commits

```
feat: adiciona sistema de ofensiva diária
fix: corrige cálculo de XP em lições refeitas
docs: atualiza README com instruções de seed
refactor: separa lógica de validação de respostas
test: adiciona testes do cálculo de liga
chore: atualiza dependências
```

---

## Deploy

### Arquitetura de Hospedagem

```
GitHub (código)
    │
    ├──► Vercel (front-end Next.js)
    │       └── deploy automático a cada push em main
    │
    └──► Supabase (banco + auth + storage)
            └── migrations versionadas no repositório
```

> **Importante:** **GitHub Pages não funciona aqui**, pois hospeda apenas sites estáticos sem back-end. Como o Hodos tem autenticação, perfis e ranking em tempo real, precisa de um back-end ativo — daí o Vercel + Supabase.

### Configurando no Vercel

1. Crie uma conta gratuita em [vercel.com](https://vercel.com)
2. Conecte ao GitHub e importe o repositório
3. Configure as variáveis de ambiente (mesmas do `.env.local`)
4. Cada push em `main` dispara um deploy automaticamente

### Configurando no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a URL e as chaves para o `.env.local`
3. Rode as migrations: `pnpm supabase db push`
4. Importe as perguntas iniciais: `pnpm seed`

---

## Roadmap

### v1.0 — MVP (lançamento inicial)

- [ ] Autenticação com Google e magic link
- [ ] Mundo 1 (Origens) completo, com 5 lições
- [ ] Sistema de XP e ofensiva diária
- [ ] Perfil básico com estatísticas
- [ ] Modo claro/escuro

### v1.5 — Engajamento

- [ ] Sistema de ligas (Cordeiro → Querubim)
- [ ] Emblemas (mínimo 12)
- [ ] Manná Diário
- [ ] Notificações push (web)

### v2.0 — Comunidade

- [ ] Modo Duelo (multiplayer 1×1)
- [ ] Modo Líder de Jovens
- [ ] Perfis públicos compartilháveis
- [ ] App mobile (React Native ou PWA)

---

## Contribuindo

Contribuições são muito bem-vindas — especialmente de jovens da igreja que queiram aprender programação na prática. É uma ótima forma de discipulado em tecnologia!

### Como contribuir

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/MinhaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFuncionalidade'`)
4. Faça push (`git push origin feature/MinhaFuncionalidade`)
5. Abra um Pull Request

### Banco de Perguntas

Adicionar novas perguntas é a forma mais simples de contribuir. Veja [`data/perguntas_iniciais.json`](./data/perguntas_iniciais.json) e siga o mesmo formato. Todas as perguntas passam por revisão pastoral antes de entrar no banco oficial.

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](./LICENSE) para mais detalhes.

---

## Agradecimentos

- À comunidade da igreja por inspirar este projeto
- Ao Duolingo por mostrar que estudar pode (e deve) ser divertido
- A Deus, autor de toda sabedoria

**Hodos** — _o caminho começa com um passo._
