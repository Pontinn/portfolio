# IDEA: project-cards-hover

## Tipo
Alteração (change) em UI existente: seção Projects do portfólio (`src/components/sections/Projects.tsx`).

## Objetivo
Fazer os cards dos projetos **Zói da Goiaba** e **Pontindex** "virarem outro card" quando a pessoa interage: com animação, mudança de cor, estilo, fonte e elementos temáticos de cada projeto, SEM perder nenhuma informação que o card mostra hoje (título, subtítulo, descrição, stack, badges, botões). Impactar quem visita o portfólio.

## Gatilho de ativação
- Desktop: hover do mouse sobre o card.
- Mobile / touch (responsivo obrigatório): ativa automaticamente quando o card estiver mais ou menos centralizado na tela (scroll), e desativa ao sair dessa faixa.

## Card Pontindex (definido pelo Pontin)
- Estado padrão: igual ao resto do site (identidade roxa do portfólio).
- No hover: cresce; fundo vira o vermelho do app Pontindex (tema classic: #DC0A2D); letras brancas; brilho vermelho em volta do card; borda interativa branca brilhante seguindo o mouse.
- Pokémon "espiando": sprites aparecem em posições aleatórias do card (alguns atrás do texto, outros na frente, até tampando), ficam ~1s e somem; rápido. 1 ou mais de uma vez; Pokémon aleatórios.
- Pokébola girando no fundo, opacidade baixa.
- Pode trocar a fonte (candidatas: Fredoka para display e Silkscreen pixel, que são as fontes do próprio Pontindex).
- Imagens vêm do próprio projeto Pontindex: sprites em `pokedex-atm/public/assets/sprites/{1..1025}.png` (96x96), pokebola em `pokedex-atm/design/pokebola.webp`, ícones em `public/icons/`.
- Paleta real do Pontindex (tema classic): primary #DC0A2D, primary-dark #A50722, secondary #2A75BB, accent #FFCB05.

## Card Zói da Goiaba (padrão pedido + sugestão do Claudão, pendente de aprovação)
- Padrão pedido pelo Pontin: cresce no hover e muda a cor do fundo; ponteiros coloridos passando pelo fundo do card.
- Identidade real do app (repo público): tema escuro roxo. bg-app #0e0b12, surface #17131e, elevated #201a2b, accent #9d00ff, accent-hover #b23dff, text #f2eef7, text-secondary #a99bc0, success #2fd47a, danger #ff3d5e. Fonte Inter. Logo: goiaba roxa com um olho no meio (play dentro da pupila) e ondas de sinal (`logo/logo-goiaba.png`).
- Ponteiros dos espectadores no app real: seta SVG na cor da pessoa (paleta fixa de 10 matizes, `hsl(H 100% L%)`, H em 20/52/85/117/150/182/215/247/280/312) com contorno escuro e pílula com o nome ao lado; somem após 5s parados.
- Sugestão em avaliação: ver seção "Sugestões" abaixo.

## Sugestões (Claudão), validadas em protótipo HTML (scratchpad/proto/index.html, 2026-09-27)

### Zói da Goiaba: "o card vira a tela de uma sala ao vivo"
- Cresce (scale 1.045) e o fundo vira o tema escuro roxo real do app (gradiente #0e0b12 -> #201a2b -> #2a1240 no canto), brilho roxo #9d00ff em volta, borda interativa roxa clara (#b23dff) seguindo o mouse.
- Texto vai para #f2eef7, subtítulo para #b23dff (accent-hover do app), badges/tags/botão migram para a paleta do Zói.
- Ponteiros dos espectadores: 4 ponteiros (seta SVG idêntica ao CursorMarker do app, contorno escuro, pílula com nome ao lado) deslizando por posições aleatórias do card, cada um na sua cor da paleta real de 10 slots. Às vezes um para e esmaece (como o idle de 5s do app) e volta. Nomes dos ponteiros = nomes dos outros projetos do portfólio (decisão do Pontin, 2026-09-27): Pitmasters, Pontindex, Experio, KobaFit. O quinto ponteiro é o "você" (mouse do visitante).
- APROVADO pelo Pontin em 2026-09-27 (sala ao vivo + ponteiros + logo + scanlines + pílula AO VIVO).
- O próprio mouse do visitante vira um ponteiro "você" (cursor nativo escondido no card): o visitante entra na sala.
- Pílula "AO VIVO" (vermelha, ponto pulsando) + fileira de avatares coloridos (iniciais, mesma cor do ponteiro de cada um) + meta "1080p60 · AV1 · P2P" no topo esquerdo. Título desce um pouco pra dar espaço; nenhuma info some.
- Logo da goiaba (olho) grande no canto inferior direito, opacidade ~0.22, flutuando devagar.
- Scanlines bem sutis por cima (o card é uma "tela").
- Fonte segue Inter (fonte do próprio Zói), sem troca de display.

### Pontindex (pedido do Pontin, com estes detalhes de execução)
- Título em Fredoka 700 com sombra vermelha escura; subtítulo e tags em Silkscreen (pixel), subtítulo amarelo #FFCB05. Pílulas "Novo" e "Em produção" e os botões "Acessar site" e "Acessar repositório" em Silkscreen (pixelada), pedido do Pontin em 2026-09-27.
- Badge "Novo" vira amarela; botão principal branco com texto vermelho e "degrau" vermelho escuro embaixo (estilo botão de jogo); botão secundário branco vazado.
- Pokémon espiando PELAS BORDAS (refinamento do Pontin em 2026-09-27): cada sprite nasce numa borda aleatória (esquerda, direita, topo ou base), GIRADO com a cabeça apontando pro centro do card (de cima: 180°, da esquerda: 90°, da direita: -90°, de baixo: normal), desliza de fora pra dentro até ficar com 65 a 85% do corpo dentro do card (o rosto SEMPRE aparece; ajuste do Pontin em 2026-09-27), posicionado pra nunca vazar pela borda perpendicular, para, e volta pelo MESMO caminho. Nunca nasce no meio. Cadência: a cada 800 a 1400 ms nasce 1 (30% das vezes 2), sprite sorteado SÓ entre 10 famosos (decisão do Pontin, 2026-09-27; IDs da Pokédex nacional): Pikachu 25, Charizard 6, Bulbasaur 1, Charmander 4, Squirtle 7, Eevee 133, Mewtwo 150, Snorlax 143, Gengar 94, Lucario 448. Sem duplicidade: um Pokémon que já está visível no card não é sorteado de novo até sair (pedido do Pontin, 2026-09-27). Sem sobreposição: um Pokémon nunca cobre outro; lado a lado pode. A posição é sorteada até 12 vezes e só aceita se não cruzar (com folga de 6 px) o retângulo de nenhum que já esteja em cena; sem vaga, pula a rodada (pedido do Pontin, 2026-09-27). Tamanho 110 a 160 px (aumentado a pedido do Pontin, 2026-09-27), ~55% atrás do texto e ~45% na frente, às vezes espelhado; vida de 3000 a 4200 ms, com ~28% do tempo entrando e ~28% saindo (ritmo desacelerado a pedido do Pontin, 2026-09-27).
- Pokébola grande no canto inferior direito, branca (dessaturada), opacidade 0.13, girando em 14 s.
- Scanlines (filtro de monitor antigo) como no Zói, mas BEM mais marcadas no Pontindex: linhas brancas a 18% de opacidade, 1 px a cada 3 px (Zói fica em 3,5% a cada 4 px). Só linhas por cima, sem trocar a cor de base (pedidos do Pontin, 2026-09-27).

### Comum aos dois
- Animação de troca IGUAL nos dois cards (pedido do Pontin, 2026-09-27): ao ativar E ao desativar, o card pisca em branco bem rápido (flash de ~260 ms, pico a ~25%) e dá uma tremida (~380 ms, deslocamento de até 7 px com leve rotação); a mudança de estilo acontece no pico do flash (~70 ms depois do início). Flash e tremida ficam fora do `prefers-reduced-motion`.
- Brilho em volta do card ativo reforçado (pedido do Pontin, 2026-09-27): três camadas de glow na cor do projeto (60px a 0.8-0.9, 140px a 0.5-0.6, 220px a 0.3-0.35) mais sombra escura de elevação.
- Gatilho desktop: hover. Gatilho touch (`hover: none`): IntersectionObserver com faixa central da viewport (rootMargin -40% em cima e embaixo); ativa quando o card cruza o centro e desativa ao sair.
- Toggle de simulação de mobile e "travar ativo" existem só no protótipo, não vão pro portfólio.
- `prefers-reduced-motion`: protótipo zera transições/animações.

## Ajustes de conteúdo pedidos junto (2026-09-27)
- Remover a tag "Playwright" da stack dos cards Zói da Goiaba e Pontindex (arrays zoiStack e pokedexStack em Projects.tsx). Removida nos dois no protótipo; confirmar se é só em um.
- Corrigir o nome do projeto "Pitmaster" para "Pitmasters Brasil" no site TODO (i18n PT/EN, títulos, textos, onde mais aparecer). Pedido do Pontin em 2026-09-27. Exceção: o ponteiro do card do Zói fica só "Pitmasters" (curto, decisão do Pontin).

## Sons (pedido do Pontin, 2026-09-27)
- Tocam na ENTRADA e na SAÍDA do estado ativo, junto com o flash, volume ~0.5.
- Pontindex: `pokedex_open.ogg` ao ativar e `pokedex_close.ogg` ao desativar (efeitos do próprio app, em `pokedex-atm/public/assets/sfx/`).
- Zói da Goiaba: sons de entrar e sair de chamada do DISCORD (o Pontin pediu explicitamente pra NÃO usar os sons do próprio Zói). Extraídos do bundle do cliente web do Discord em 2026-09-27: `user_join.mp3` (assets/b135ff6c8e091b43.mp3) e `user_leave.mp3` (assets/7b9a183742515fc2.mp3), 320 kbps. Cópias em `ui-refs/proto/discord_join.mp3` e `discord_leave.mp3`.
- Atenção (autoplay): navegadores só liberam áudio depois de um gesto real (clique/toque) na página; hover e scroll não contam. Na implementação, o som deve falhar em silêncio até o primeiro clique/toque, e ser liberado no primeiro `pointerdown` da página (pré-aquecer os áudios). No mobile, o som só vai tocar se a pessoa já tiver tocado na página antes de rolar até o card.
- Precisa de um controle de mudo? (em aberto)

## Assets a trazer pro diretório do portfólio na implementação (pedido do Pontin, 2026-09-27)
- Tudo vai pra dentro do portfólio (ex.: `public/projects/pontindex/` e `public/projects/zoi/`), nada referenciado de pasta externa:
  - 10 sprites dos Pokémon famosos: `pokedex-atm/public/assets/sprites/{1,4,6,7,25,94,133,143,150,448}.png` (96x96).
  - Pokébola: `pokedex-atm/design/pokebola.webp`.
  - Sons do Pontindex: `pokedex_open.ogg`, `pokedex_close.ogg`.
  - Logo do Zói: `logo-goiaba.png` (859x891, baixado do repo público; cópia em `ui-refs/proto/`).
  - Sons do Discord: `discord_join.mp3`, `discord_leave.mp3` (cópias em `ui-refs/proto/`).
  - Fontes Fredoka e Silkscreen (Google Fonts, via next/font como as Geist já usadas). Inter para o Zói (ou usar a Geist do site, a decidir no SPEC).

## Fora de escopo / não mudar
(a confirmar com o Pontin)

## Superfície de regressão
- Os outros cards (Pitmaster, Experio, KobaFit, repos do GitHub) continuam como estão.
- Conteúdo/i18n dos cards não muda.

## Perguntas em aberto
- Aprovação da proposta do card Zói.
- Tema claro: o card transformado deve ser igual nos dois temas do portfólio?
- `prefers-reduced-motion`: reduzir/desligar a animação?
