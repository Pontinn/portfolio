# pontin.dev — Portfolio

Portfolio pessoal de Leonardo Pontin, desenvolvedor Full Stack com foco em backend.

---

## Stack

**Framework**
- [Next.js 16](https://nextjs.org/) — App Router, server components, API routes, Turbopack
- [TypeScript](https://www.typescriptlang.org/)

**Estilização**
- [Tailwind CSS v4](https://tailwindcss.com/)

**3D & Partículas**
- [Three.js](https://threejs.org/) — renderer WebGL
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — renderer React para Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) — helpers para Three.js

**Animação & UI**
- [GSAP](https://gsap.com/) + ScrollTrigger + TextPlugin — animações de scroll e efeito de digitação
- [Framer Motion](https://www.framer.com/motion/) — marquee infinito de tecnologias e Counter
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll
- Componentes inspirados em [React Bits](https://reactbits.dev/) — BorderGlow, DecryptedText, Counter, DotField

**Ícones**
- [Lucide React](https://lucide.dev/) — ícones genéricos
- [React Icons](https://react-icons.github.io/react-icons/) — logos de marca (SimpleIcons)

**Internacionalização**
- i18n customizado — PT-BR / EN com detecção automática via `navigator.language` e [ipapi.co](https://ipapi.co/)

**APIs**
- GitHub REST API — repositórios públicos (proxy server-side com cache de 1h)

## Funcionalidades

- **Campo de partículas** (Three.js/R3F) reagindo a scroll, mouse e digitação
- **Estados de partículas por seção**: retrato → cluster do sobre → scatter de skills → timeline de experiência → órbita de projetos → convergência de contato
- **Marquee de tecnologias** com duas fileiras infinitas em direções opostas (Framer Motion + pixel-precise measurement)
- **BorderGlow nos cards** — efeito de glow nas bordas seguindo cursor (Skills, Experience, Projects, foto do About, botões CTA)
- **DecryptedText** nos títulos de seção — animação de decodificação disparada no scroll-in-view
- **Counter animado** (estilo odômetro) nos stats do Pitmaster
- **DotField** interativo como background da seção Contato — dots reagem ao cursor com bulge effect
- **Efeito de digitação GSAP** no Hero com zona de repulsão nas partículas
- **CTAs com gradiente roxo** (Hero + Contact) com glow externo + shadow inset
- **Tema dark / light**
- **Idioma PT-BR / EN** com detecção automática
- **Totalmente responsivo**
- **Otimizações de performance**: animações pausam off-screen via IntersectionObserver, marquee usa `will-change: transform`, sem `backdrop-blur` em listas longas

---

# pontin.dev — Portfolio

Personal portfolio of Leonardo Pontin, Full Stack Developer with a backend focus.

---

## Stack

**Framework**
- [Next.js 16](https://nextjs.org/) — App Router, server components, API routes, Turbopack
- [TypeScript](https://www.typescriptlang.org/)

**Styling**
- [Tailwind CSS v4](https://tailwindcss.com/)

**3D & Particles**
- [Three.js](https://threejs.org/) — WebGL renderer
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) — Three.js helpers

**Animation & UI**
- [GSAP](https://gsap.com/) + ScrollTrigger + TextPlugin — scroll animations and typing effect
- [Framer Motion](https://www.framer.com/motion/) — infinite tech marquee and Counter
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll
- Components inspired by [React Bits](https://reactbits.dev/) — BorderGlow, DecryptedText, Counter, DotField

**Icons**
- [Lucide React](https://lucide.dev/) — generic icons
- [React Icons](https://react-icons.github.io/react-icons/) — brand logos (SimpleIcons)

**Internationalization**
- Custom i18n — PT-BR / EN with automatic detection via `navigator.language` and [ipapi.co](https://ipapi.co/)

**APIs**
- GitHub REST API — public repositories (server-side proxy with 1h cache)

## Features

- **Particle field** (Three.js/R3F) reacting to scroll, mouse and typing
- **Per-section particle states**: face portrait → about cluster → skills scatter → experience timeline → projects orbital → contact convergence
- **Tech marquee** with two infinite rows scrolling in opposite directions (Framer Motion + pixel-precise measurement)
- **BorderGlow on cards** — cursor-following border glow effect (Skills, Experience, Projects, About photo, CTA buttons)
- **DecryptedText** on section titles — decryption animation triggered on scroll-in-view
- **Animated Counter** (odometer style) on Pitmaster stats
- **Interactive DotField** as Contact section background — dots react to cursor with bulge effect
- **GSAP typing effect** in Hero with particle repulsion zone
- **Purple gradient CTAs** (Hero + Contact) with outer glow + inset shadow
- **Dark / Light theme**
- **PT-BR / EN language toggle** with auto-detection
- **Fully responsive**
- **Performance optimizations**: animations pause off-screen via IntersectionObserver, marquee uses `will-change: transform`, no `backdrop-blur` in long lists
