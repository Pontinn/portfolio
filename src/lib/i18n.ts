export type Lang = "pt" | "en"

export const translations = {
  pt: {
    nav: {
      about: "Sobre",
      skills: "Skills",
      experience: "Experiência",
      projects: "Projetos",
      contact: "Contato",
    },
    hero: {
      greeting: "Olá, eu sou",
      name: "Leonardo Pontin",
      titles: [
        "Full Stack Developer",
        "Backend Engineer",
        "Java · Spring Boot",
      ],
      contact: "leo@pontin.dev",
      cta: "Entrar em contato",
    },
    about: {
      title: "Sobre mim",
      age: "anos",
      role: "Full Stack Developer · Backend Focus",
      bio: [
        "Comecei minha carreira criando sites e landing pages com WordPress, mas sempre soube que queria mais: estudei o ecossistema JavaScript em paralelo e fui migrando cada vez mais para o código puro. Meu sonho sempre foi o backend, e quando comecei a estudar Java foi onde me apaixonei de verdade.",
        "Hoje sou desenvolvedor Full Stack com foco em backend, atuo como Head de TI da Mave Company e tenho sistemas reais rodando em produção, entre eles o KalyFit e o KobaFit, apps disponíveis na Play Store e Apple Store, onde atuei 100% no backend. Além disso, gerencio o desenvolvimento de uma plataforma completa de competições de churrasco com centenas de usuários ativos e crescendo.",
        "Atualmente busco ir além da entrega. Me interessa entender tendências como IA e agentes, usar ferramentas que ampliem minha capacidade e continuar evoluindo como engenheiro.",
      ],
    },
    skills: {
      title: "Skills",
      categories: {
        backend: "Backend",
        frontend: "Frontend",
        cloud: "Cloud & DevOps",
      },
    },
    experience: {
      title: "Experiência",
      present: "Presente",
      items: [
        {
          company: "Mave Company",
          role: "Head de TI · Full Stack Developer",
          period: "2024 - Presente",
          description:
            "Entrei como desenvolvedor criando landing pages e sites institucionais. Migrei progressivamente para desenvolvimento com código puro e, em 2026, assumi a posição de Head de TI. Hoje sou o responsável pelo setor e entrego sistemas complexos em produção, incluindo a plataforma Pitmaster de competições de churrasco.",
        },
        {
          company: "Freelance",
          role: "Backend Developer",
          period: "2024 - Presente",
          description:
            "Desenvolvimento backend para clientes de diferentes segmentos. Projetos incluem KalyFit (app de emagrecimento com IA, Play Store e Apple Store) e KobaFit (plataforma fitness SaaS multi-tenant atendendo Brasil e Argentina).",
        },
      ],
    },
    projects: {
      title: "Projetos",
      inProduction: "Em produção",
      liveApp: "App nas lojas",
      viewCode: "Ver código",
      privateRepo: "Repositório privado",
      visitSite: "Acessar site",
      publicSource: "Código público",
      visitRepo: "Acessar repositório",
      newBadge: "Novo",
      personalProject: "Projeto pessoal",
      live: "AO VIVO",
      you: "você",
      pitmaster: {
        title: "Pitmaster",
        subtitle: "Plataforma de Competições de Churrasco",
        description:
          "A Pitmaster é uma plataforma completa de competições de churrasco que eu construí do zero e mantenho em produção há mais de um ano. Backend em Java 17, Spring Boot 3, Spring Security e PostgreSQL, com mais de 110 migrations Flyway e quase 40 controllers REST. O núcleo é o motor de competições: inscrição de equipes com pagamento via Stripe e Mercado Pago (webhooks, estornos, cupons com escopo combinável e cálculo do valor líquido com a taxa real de cada gateway), avaliação às cegas com códigos anônimos, lotes de notas e trilha de auditoria, juízes oficiais e populares, e ranking automático. Em cima disso nasceram as Ligas anuais, com regras de pontuação configuráveis, bônus por categoria e ranking público, e uma loja oficial com catálogo flexível por variação, carrinho, checkout e controle de retirada presencial nos eventos. Na infraestrutura, implementei um Outbox de e-mails transacionais em PostgreSQL (retry, dead-letter e idempotência sem broker externo), jobs agendados de reconciliação e inativação automática de equipes, refresh token com versionamento, rate limiting com Bucket4j, soft delete e anonimização LGPD. Mais de 100 classes de teste com JUnit e TestContainers rodando no GitHub Actions, frontend em React + TypeScript com Vite e deploy containerizado com Docker e Nginx. O sistema está no ar, faturando e com centenas de usuários ativos.",
      },
      zoi: {
        title: "Zói da Goiaba",
        subtitle: "Compartilhamento de Tela P2P para Windows",
        description:
          "Quando o Discord removeu o compartilhamento de tela no Brasil, as sessões de filme e as noites de jogo com os amigos acabaram. Em vez de pagar mensalidade por um serviço, construí a solução: um app desktop para Windows onde até 8 pessoas se conectam em uma malha WebRTC ponto a ponto, sem servidor de mídia e sem backend próprio. O estado da sala vive nos próprios clientes via DataChannel, com o dono da sala como autoridade, e o PeerJS público entra só na sinalização. Escrevi um addon nativo em C++ para capturar o áudio do sistema por aplicativo, e os ponteiros dos espectadores são desenhados sobre a tela real de quem transmite, em uma janela transparente excluída da própria captura. Presets até 1080p60, codec escolhido por máquina entre AV1, VP9, H264 e VP8 priorizando encoder de hardware, picture-in-picture, moderação, reconexão automática e atualização via GitHub Releases. Electron, React e TypeScript, com testes unitários em Vitest e end-to-end em Playwright. O código é público: qualquer pessoa pode acessar o repositório, baixar o instalador na página de Releases e usar. Em desenvolvimento ativo.",
      },
      pokedex: {
        title: "Pontindex",
        subtitle: "Pokedex para o modpack All the Mons (Cobblemon)",
        description:
          "Todo mundo que começa a programar faz uma Pokedex em algum momento. A minha foi em 2024, em HTML, CSS e JavaScript puro consumindo a PokeAPI. Anos depois resolvi fazer a definitiva: uma Pokedex compatível com o All the Mons, um modpack de Minecraft com Pokemon baseado no Cobblemon que eu e meus amigos jogamos. No meio do jogo sempre surge a dúvida: em que nível evolui, qual Pokebola usar, qual treinador libera o próximo level cap. Sites de Pokemon não servem, porque o Cobblemon e os addons mudam evoluções, spawns e itens, e até os sites feitos para ele espalham a informação em cinco abas. A ideia foi centralizar tudo num lugar só, com a essência de Pokemon: cores, animações e sons. Um pipeline de build lê os jars e configs do próprio modpack e gera JSON, texturas, sons e traduções PT/EN empacotados no app (1.027 Pokemon, 1.589 treinadores, 949 itens), com auditoria independente dos dados. Ficha completa com evoluções no método exato do Cobblemon, onde encontrar, melhor Pokebola, treinadores com level cap e sincronização por QR code. PWA offline, sem conta, sem backend e custo zero. React 19, TypeScript, Vite, Zustand e IndexedDB, com testes em Vitest e Playwright.",
      },
      experio: {
        title: "Experio",
        subtitle: "Marketplace de Experiências Turísticas",
        description:
          "Experio é um marketplace de experiências turísticas com três lados: viajantes que descobrem lugares e reservam experiências pelo app, negócios que publicam e vendem essas experiências, e parceiros (agências, agentes e influenciadores) que indicam viajantes e ganham comissão. Backend em NestJS com Prisma e PostgreSQL, Redis, pagamentos com Stripe, integração com Google Places e cinco idiomas, servindo quatro painéis web em React e um app mobile com Capacitor. Entrei com o projeto já em andamento e atuei em várias frentes: correção de bugs, internacionalização (traduzi painéis inteiros e o contrato de idiomas da API), o painel de Parceiros completo (campanhas de indicação com links curtos e QR codes, atribuição de indicações, motor de comissões com ciclo de vida, solicitações de saque, assinatura de parceiros no Stripe, detecção de fraude com revisão manual e relatórios exportáveis) e features menores nos painéis de admin, business e traveler, como concessão manual de planos, notificações push e vinculação de indicações no cadastro. Trabalho em equipe, com mais de 300 commits meus entre backend e frontends.",
      },
      kobafit: {
        title: "KobaFit",
        subtitle: "Plataforma Fitness Multi-Tenant",
        description:
          "KobaFit é uma plataforma fitness SaaS multi-tenant onde academias assinam para ter um aplicativo próprio com a sua identidade visual. Neste projeto trabalhei unicamente no backend, em Java 17 e Spring Boot, construindo toda a arquitetura multi-tenant do zero: cada academia opera em um ambiente isolado, com o tenant resolvido a cada requisição por um filtro dedicado e propagado por toda a camada de serviço. Modelei os perfis de aluno, professor, admin e super admin com permissões por papel, o módulo de treinos com rotinas, execuções e histórico, anamnese e perfil de saúde, dieta gerada por IA via API da OpenAI a partir do perfil nutricional do aluno, e gamificação com pontos por treino e refeição concluída. As assinaturas rodam no Stripe com planos mensal e anual, preço por moeda e webhooks, e o super admin tem visão consolidada de todos os tenants, com painel financeiro e comissão configurável por academia. PostgreSQL com Flyway, JWT e deploy com Docker. A plataforma está no ar atendendo academias no Brasil e na Argentina.",
      },
      github: {
        title: "Repositórios Públicos",
        noDescription: "Sem descrição",
        stars: "estrelas",
      },
    },
    contact: {
      title: "Contato",
      subtitle: "Vamos conversar?",
      description:
        "Estou sempre aberto a novas oportunidades, projetos interessantes ou apenas uma boa conversa sobre tecnologia.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      name: "Leonardo Pontin",
      titles: [
        "Full Stack Developer",
        "Backend Engineer",
        "Java · Spring Boot",
      ],
      contact: "leo@pontin.dev",
      cta: "Get in touch",
    },
    about: {
      title: "About me",
      age: "years old",
      role: "Full Stack Developer · Backend Focus",
      bio: [
        "I started my career building websites and landing pages with WordPress, but always knew I wanted more: I studied the JavaScript ecosystem in parallel and gradually moved toward writing real code. My dream was always backend, and when I started studying Java, that's where I truly fell in love with engineering.",
        "Today I'm a Full Stack Developer focused on backend, working as Head of IT at Mave Company with real systems running in production, including KalyFit and KobaFit, apps available on the Play Store and Apple Store, where I worked 100% on the backend. I also manage the development of a full competition platform for the BBQ niche, with hundreds of active users and growing.",
        "I'm always looking beyond delivery. I'm interested in trends like AI and agents, tools that expand my capabilities, and continuing to grow as an engineer.",
      ],
    },
    skills: {
      title: "Skills",
      categories: {
        backend: "Backend",
        frontend: "Frontend",
        cloud: "Cloud & DevOps",
      },
    },
    experience: {
      title: "Experience",
      present: "Present",
      items: [
        {
          company: "Mave Company",
          role: "Head of IT · Full Stack Developer",
          period: "2024 - Present",
          description:
            "Joined as a developer building landing pages and institutional websites. Progressively moved to writing pure code and, in 2026, took on the Head of IT position. Today I'm responsible for the department and deliver complex systems in production, including the Pitmaster BBQ competition platform.",
        },
        {
          company: "Freelance",
          role: "Backend Developer",
          period: "2024 - Present",
          description:
            "Backend development for clients across different segments. Projects include KalyFit (AI weight loss app, Play Store and Apple Store) and KobaFit (multi-tenant SaaS fitness platform serving Brazil and Argentina).",
        },
      ],
    },
    projects: {
      title: "Projects",
      inProduction: "In production",
      liveApp: "Live on stores",
      viewCode: "View code",
      privateRepo: "Private repository",
      visitSite: "Visit site",
      publicSource: "Public source",
      visitRepo: "Visit repository",
      newBadge: "New",
      personalProject: "Personal project",
      live: "LIVE",
      you: "you",
      pitmaster: {
        title: "Pitmaster",
        subtitle: "BBQ Competition Platform",
        description:
          "Pitmaster is a full-featured BBQ competition platform that I built from scratch and have kept in production for over a year. The backend runs on Java 17, Spring Boot 3, Spring Security and PostgreSQL, with 110+ Flyway migrations and nearly 40 REST controllers. At its core is the competition engine: team enrollment with Stripe and Mercado Pago payments (webhooks, refunds, combinable-scope coupons and net revenue calculated from each gateway's real fee), blind judging with anonymous codes, score batches and an audit trail, official and popular judges, and automatic ranking. On top of that came annual Leagues, with configurable scoring rules, category bonuses and a public ranking, plus an official store with a flexible variant catalog, cart, checkout and in-person pickup tracking at events. On the infrastructure side, I implemented a transactional email Outbox in PostgreSQL (retry, dead-letter and idempotency with no external broker), scheduled reconciliation and team auto-inactivation jobs, refresh tokens with versioning, Bucket4j rate limiting, soft delete and LGPD anonymization. Over 100 test classes with JUnit and TestContainers run on GitHub Actions, the frontend is React + TypeScript with Vite, and deployment is containerized with Docker and Nginx. The system is live, generating revenue, and serving hundreds of active users.",
      },
      zoi: {
        title: "Zói da Goiaba",
        subtitle: "P2P Screen Sharing for Windows",
        description:
          "When Discord removed screen sharing in Brazil, movie sessions and game nights with friends came to an end. Instead of paying a monthly fee for a service, I built the solution: a Windows desktop app where up to 8 people connect through a peer-to-peer WebRTC mesh, with no media server and no backend of its own. Room state lives in the clients themselves via DataChannel, with the room owner as the authority, and the public PeerJS server is used only for signaling. I wrote a native C++ addon to capture system audio per application, and viewers' pointers are drawn over the presenter's real screen in a transparent window excluded from the capture itself. Presets up to 1080p60, per-machine codec selection among AV1, VP9, H264 and VP8 favoring hardware encoders, picture-in-picture, moderation, automatic reconnection and updates via GitHub Releases. Electron, React and TypeScript, with unit tests in Vitest and end-to-end tests in Playwright. The source is public: anyone can access the repository, download the installer from the Releases page and use it. Under active development.",
      },
      pokedex: {
        title: "Pontindex",
        subtitle: "Pokedex for the All the Mons modpack (Cobblemon)",
        description:
          "Everyone who starts programming builds a Pokedex at some point. Mine was in 2024, in plain HTML, CSS and JavaScript consuming the PokeAPI. Years later I decided to build the definitive one: a Pokedex compatible with All the Mons, a Minecraft modpack with Pokemon based on Cobblemon that my friends and I play. Mid-game the questions always come up: what level does it evolve at, which Pokeball to use, which trainer unlocks the next level cap. Pokemon websites don't help, because Cobblemon and the addons change evolutions, spawns and items, and even the sites made for it scatter the information across five tabs. The idea was to centralize everything in one place, with the essence of Pokemon: colors, animations and sounds. A build pipeline reads the modpack's own jars and configs and generates JSON, textures, sounds and PT/EN translations bundled into the app (1,027 Pokemon, 1,589 trainers, 949 items), with an independent data audit. Full entries with Cobblemon's exact evolution methods, where to find, best Pokeball, trainers with level caps and QR code sync. Offline PWA, no account, no backend and zero cost. React 19, TypeScript, Vite, Zustand and IndexedDB, with tests in Vitest and Playwright.",
      },
      experio: {
        title: "Experio",
        subtitle: "Travel Experiences Marketplace",
        description:
          "Experio is a travel experiences marketplace with three sides: travelers who discover places and book experiences through the app, businesses that publish and sell those experiences, and partners (agencies, agents and influencers) who refer travelers and earn commissions. The backend runs on NestJS with Prisma and PostgreSQL, Redis, Stripe payments, Google Places integration and five languages, serving four React web panels and a Capacitor mobile app. I joined with the project already underway and worked on several fronts: bug fixing, internationalization (I translated entire panels and the API's language contract), the complete Partners panel (referral campaigns with short links and QR codes, referral attribution, a commission engine with a full lifecycle, withdrawal requests, partner subscriptions on Stripe, fraud detection with manual review and exportable reports) and smaller features across the admin, business and traveler panels, such as manual plan grants, push notifications and referral linking at signup. Team work, with over 300 commits of mine across the backend and frontends.",
      },
      kobafit: {
        title: "KobaFit",
        subtitle: "Multi-Tenant Fitness Platform",
        description:
          "KobaFit is a multi-tenant SaaS fitness platform where gyms subscribe to get their own branded app. On this project I worked exclusively on the backend, in Java 17 and Spring Boot, building the entire multi-tenant architecture from scratch: each gym runs in an isolated environment, with the tenant resolved on every request by a dedicated filter and propagated through the whole service layer. I modeled the student, trainer, admin and super admin profiles with role-based permissions, the workout module with routines, executions and history, anamnesis and health profile, AI-generated diets through the OpenAI API based on each student's nutrition profile, and gamification with points for completed workouts and meals. Subscriptions run on Stripe with monthly and annual plans, per-currency pricing and webhooks, and the super admin has a consolidated view across all tenants, with a financial dashboard and a configurable commission per gym. PostgreSQL with Flyway, JWT and Docker deployment. The platform is live, serving gyms in Brazil and Argentina.",
      },
      github: {
        title: "Public Repositories",
        noDescription: "No description",
        stars: "stars",
      },
    },
    contact: {
      title: "Contact",
      subtitle: "Let's talk?",
      description:
        "I'm always open to new opportunities, interesting projects, or just a good conversation about technology.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },
} as const

export function getAge(): number {
  const today = new Date()
  const birth = new Date(2003, 0, 6)
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  if (!hasHadBirthday) age--
  return age
}

export async function detectLanguage(): Promise<Lang> {
  if (typeof navigator === "undefined") return "en"

  const navLang = navigator.language?.toLowerCase()
  if (navLang === "pt-br" || navLang === "pt") return "pt"

  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    if (data.country_code === "BR") return "pt"
  } catch {
    // fallback to en
  }

  return "en"
}
