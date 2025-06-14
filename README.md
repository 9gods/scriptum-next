# Scriptum

Editor e organizador de notas em **Markdown**, minimalista e focado em produtividade.

## Principais funcionalidades

* **Criação, edição e exclusão de notas** em Markdown
* **Tags e fixação de notas importantes**
* **Pesquisa instantânea** por título, tag ou conteúdo
* **Interface responsiva** wip

## Stack

| Camada              | Tecnologias                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| Frontend            | Next.js 14 · React 18 · TypeScript · Tailwind CSS (ShadcnUI) · Framer Motion |
| Build/Dev           | Turbopack + Biomejs                                               |
| Hosting | Vercel                                                                       |

## Começando

```bash
# 1. Clone o repositório
git clone https://github.com/9gods/scriptum-next.git
cd scriptum-next

# 2. Instale dependências
bun install            # ou npm/yarn

# 3. Variáveis de ambiente
cp .env.example .env.local
#  └─ todo

# 4. Rode em modo dev
bun run dev                # http://localhost:3000
```

## Roadmap

* [X] Modo escuro automático
* [ ] Exportação para PDF/HTML
* [ ] Compartilhamento público de notas
* [ ] Compartilhamento público de notas

## Autores

* Giovane Comelli / 9gods
* Rafael Gonçalves
* Eduarda Krapczak
* Giullia Villanova
* Maria Eduarda Kolitski
