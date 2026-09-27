# SPEC (quick): project-cards-hover

Caminho `--quick` do forge, declarado pelo Pontin em 2026-09-27. Sem PRD. Este arquivo é o plano executável curto.
Fonte de verdade do COMPORTAMENTO e do VISUAL: `IDEA_project-cards-hover.md` + o protótipo `ui-refs/proto/index.html` (abrir no navegador, ler o CSS/JS: tudo que está lá foi aprovado pelo Pontin, valor por valor).

## Regras globais (não negociáveis)
- Identificadores de código em INGLÊS (camelCase/PascalCase, como o resto de `src/`). Texto visível segue o i18n (PT/EN).
- PROIBIDO travessão (em dash) em qualquer texto gerado: código, comentários, strings, commits.
- Commits: Conventional Commits, em português como o histórico do repo, SEM linha `Co-Authored-By`. Um commit por feature. Nunca `--amend`, nunca `--no-verify`. NUNCA fazer push.
- Nada referenciado de pasta externa: todo asset vai pra `public/`.
- Os outros cards (Pitmasters Brasil, Experio, KobaFit, repos do GitHub) e o resto do site NÃO mudam.
- Nenhuma informação dos dois cards some no estado ativo (título, subtítulo, descrição, stack, badges, botões, links).
- Tema claro do portfólio: o card ativo fica IGUAL ao do tema escuro (carrega a marca do projeto). O estado normal continua respeitando o tema como hoje.
- `prefers-reduced-motion`: só a troca de cor/estilo, sem flash, tremida, Pokémon, ponteiros, pokébola girando, logo flutuando. Sons também não tocam.
- Playwright pra validar UI: `chromium.launch({ headless: false, slowMo: 2000 })` (regra do Pontin), scripts fora do repo ou em `tests/` sem entrar no build.

## Sprint 1: assets e fontes (feature 1.1)
- Copiar para o portfólio:
  - `public/projects/pontindex/sprites/{1,4,6,7,25,94,133,143,150,448}.png` de `C:/Users/milap/OneDrive/Desktop/leo/pokedex-atm/public/assets/sprites/`.
  - `public/projects/pontindex/pokebola.webp` de `C:/Users/milap/OneDrive/Desktop/leo/pokedex-atm/design/pokebola.webp`.
  - `public/projects/pontindex/pokedex_open.ogg` e `pokedex_close.ogg` de `C:/Users/milap/OneDrive/Desktop/leo/pokedex-atm/public/assets/sfx/`.
  - `public/projects/zoi/logo-goiaba.png`, `discord_join.mp3`, `discord_leave.mp3` de `.forge/ideas/project-cards-hover/ui-refs/proto/`.
- Fontes: adicionar `Fredoka` (pesos 500/600/700) e `Silkscreen` (400/700) via `next/font/google` em `src/app/layout.tsx`, expostas como `--font-fredoka` e `--font-silkscreen` (mesmo padrão das Geist). O card do Zói usa a fonte do site (Geist), sem carregar Inter.
- Done when: arquivos em `public/`, build passa, fontes disponíveis como CSS vars.

## Sprint 2: card transformável (feature 2.1)
Arquivos novos em `src/components/projects/` (nome da pasta é sugestão; seguir o padrão `src/components/ui|sections`):
- `useCardActivation.ts`: hook que devolve `active` + handlers. Desktop (`matchMedia("(hover: hover)")`): ativa em `pointerenter`, desativa em `pointerleave`. Touch (`(hover: none)`): `IntersectionObserver` com `rootMargin: "-40% 0px -40% 0px"`, ativa ao cruzar a faixa central, desativa ao sair.
- `useSwitchFx.ts` (ou dentro do componente): a troca de estado igual nos dois cards: flash branco (260 ms, pico a 25%) + tremida (380 ms, até 7 px e 0.6deg, via `translate`/`rotate` pra não brigar com o `scale`), mudança de estilo 70 ms depois do início, som tocando junto (volume 0.5, `play().catch(() => {})`, pré-aquecer os áudios no primeiro `pointerdown` da página).
- `TransformCard.tsx` (ou nome equivalente): recebe `variant: "pontindex" | "zoi"` e o conteúdo atual do card; aplica classes de estado ativo. Estado normal = EXATAMENTE o card de hoje (BorderGlow roxo etc.). Scanlines nos dois (Zói 3,5%/4px; Pontindex 18%/3px).
- `PontindexFx.tsx`: pokébola girando (14 s, opacidade 0.13, branca), Pokémon espiando (regras do IDEA: 10 famosos, sem duplicar, sem sobrepor, pelas bordas com a cabeça pro centro, 65 a 85% dentro, 110 a 160 px, vida 3000 a 4200 ms, novo a cada 800 a 1400 ms, metade atrás e metade na frente do texto), fontes Fredoka (título) e Silkscreen (subtítulo, tags, pílulas, botões), paleta classic (#DC0A2D, #A50722, #FFCB05), brilho vermelho forte, borda BorderGlow branca.
- `ZoiFx.tsx`: fundo do tema do Zói (#0e0b12 → #201a2b → #2a1240), brilho roxo forte, 4 ponteiros (Pitmasters, Pontindex, Experio, KobaFit) com a seta SVG e a paleta hsl de 10 slots do app, idle/fade ocasional, ponteiro "você" seguindo o mouse (cursor nativo escondido só no desktop), pílula AO VIVO + avatares + "1080p60 · AV1 · P2P", logo da goiaba flutuando a 0.22.
- Integrar em `src/components/sections/Projects.tsx`: os itens Zói e Pontindex do grid 2x2 passam a renderizar pelo card transformável; os outros dois itens continuam iguais.
- Done when: `npm run build` passa, a página renderiza sem erro de console, hover no desktop e faixa central no mobile funcionam, screenshot do estado ativo dos dois cards bate com `ui-refs/proto` (mesmas cores, mesmos elementos), nenhuma info sumiu.

## Sprint 3: ajustes de conteúdo (feature 3.1)
- Remover "Playwright" de `zoiStack` e `pokedexStack` em `Projects.tsx`.
- Renomear "Pitmaster" para "Pitmasters Brasil" no site todo: `src/lib/i18n.ts` (título e descrição do projeto em PT e EN, texto da experiência em PT e EN) e qualquer outra ocorrência em `src/` (fazer grep -ri pitmaster). O ponteiro do Zói fica só "Pitmasters".
- Done when: grep -ri "pitmaster" em `src/` só retorna "Pitmasters Brasil", "Pitmasters" (ponteiro) e identificadores de código (`pitmasterStack`, `t.projects.pitmaster`), que NÃO mudam.

## Sprint 4: teste proporcional (feature 4.1)
- Script Playwright (headless false, slowMo 2000) em `tests/e2e/project-cards-hover.spec.ts` ou equivalente fora do build: abre `http://localhost:3000`, rola até #projects, hover no card Pontindex → verifica classe/atributo de ativo, presença de sprites (com src em `/projects/pontindex/sprites/`), nenhum par de sprites se cruzando; sai → desativa. Hover no Zói → 5 ponteiros presentes com os nomes certos. Viewport 390x844 com `hasTouch` → ao centralizar o card, ativa. Zero erros de console.
- Done when: script roda verde contra o dev server.
