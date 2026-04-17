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
      cta: "Ver projetos",
    },
    about: {
      title: "Sobre mim",
      age: "anos",
      role: "Full Stack Developer · Backend Focus",
      bio: [
        "Comecei minha carreira criando sites e landing pages com WordPress, mas sempre soube que queria mais — estudei o ecossistema JavaScript em paralelo e fui migrando cada vez mais para o código puro. Meu sonho sempre foi o backend, e quando comecei a estudar Java foi onde me apaixonei de verdade.",
        "Hoje sou desenvolvedor Full Stack com foco em backend, lidero o setor de TI da Mave Company e tenho sistemas reais rodando em produção — entre eles o KalyFit e o KobaFit, apps disponíveis na Play Store e Apple Store, onde atuei 100% no backend. Além disso, gerencio o desenvolvimento de uma plataforma completa de competições de churrasco com centenas de usuários ativos e crescendo.",
        "Atualmente busco ir além da entrega — me interessa entender tendências como IA e agentes, usar ferramentas que ampliem minha capacidade e continuar evoluindo como engenheiro.",
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
          role: "Líder de TI · Full Stack Developer",
          period: "2024 — Presente",
          description:
            "Entrei como desenvolvedor criando landing pages e sites institucionais. Migrei progressivamente para desenvolvimento com código puro e, em 2026, assumi a liderança do setor de TI. Hoje lidero o setor e entrego sistemas complexos em produção — incluindo a plataforma Pitmaster de competições de churrasco.",
        },
        {
          company: "Freelance",
          role: "Backend Developer",
          period: "2024 — Presente",
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
      pitmaster: {
        title: "Pitmaster",
        subtitle: "Plataforma de Competições de Churrasco",
        description:
          "A Pitmaster é uma plataforma completa de gerenciamento de competições de churrasco — um nicho específico e apaixonante. Faço parte do projeto desde o início e, com o crescimento do sistema, assumi a liderança do desenvolvimento backend. Construí toda a arquitetura com Java, Spring Boot e PostgreSQL: cadastro de usuários e times com transferência de liderança, inscrição em competições com pagamento via Stripe e MercadoPago, sistema de juízes com fluxo de solicitação e aprovação, avaliação de proteínas por sabor, aparência e textura com ranking automático, uploads de mídia na AWS S3 e painel administrativo completo com relatórios de usuários, times e desempenho financeiro. O sistema está no ar, faturando e com centenas de usuários ativos — e continua crescendo.",
      },
      kalyfit: {
        title: "KalyFit",
        subtitle: "App de Emagrecimento com IA",
        description:
          "KalyFit é um app de emagrecimento que usa inteligência artificial para tornar o acompanhamento nutricional simples e personalizado. Trabalhei 100% no backend — integrei a API da OpenAI para análise de calorias por foto de alimentos e geração de dietas únicas baseadas no perfil de cada usuário, além de construir toda a estrutura de autenticação, assinatura via Stripe e painel administrativo. O app está disponível na Play Store e Apple Store.",
      },
      kobafit: {
        title: "KobaFit",
        subtitle: "Plataforma Fitness Multi-Tenant",
        description:
          "KobaFit é uma plataforma fitness SaaS multi-tenant onde academias pagam mensalmente para ter um aplicativo próprio com sua identidade visual. Trabalhei 100% no backend, construindo toda a arquitetura multi-tenant do zero — cada academia opera em um ambiente completamente isolado, com gestão de treinos, anamnese, histórico de execuções e relatórios. O SuperAdmin tem visão consolidada de todos os tenants, incluindo painel financeiro. A plataforma atende academias no Brasil e na Argentina.",
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
      cta: "View projects",
    },
    about: {
      title: "About me",
      age: "years old",
      role: "Full Stack Developer · Backend Focus",
      bio: [
        "I started my career building websites and landing pages with WordPress, but always knew I wanted more — I studied the JavaScript ecosystem in parallel and gradually moved toward writing real code. My dream was always backend, and when I started studying Java, that's where I truly fell in love with engineering.",
        "Today I'm a Full Stack Developer focused on backend, leading the IT department at Mave Company with real systems running in production — including KalyFit and KobaFit, apps available on the Play Store and Apple Store, where I worked 100% on the backend. I also manage the development of a full competition platform for the BBQ niche, with hundreds of active users and growing.",
        "I'm always looking beyond delivery — I'm interested in trends like AI and agents, tools that expand my capabilities, and continuing to grow as an engineer.",
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
          role: "IT Lead · Full Stack Developer",
          period: "2024 — Present",
          description:
            "Joined as a developer building landing pages and institutional websites. Progressively moved to writing pure code and, in 2026, took on the IT Lead role. Today I lead the department and deliver complex systems in production — including the Pitmaster BBQ competition platform.",
        },
        {
          company: "Freelance",
          role: "Backend Developer",
          period: "2024 — Present",
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
      pitmaster: {
        title: "Pitmaster",
        subtitle: "BBQ Competition Platform",
        description:
          "Pitmaster is a full-featured platform for managing BBQ competitions — a specific and passionate niche. I've been part of the project from day one and, as the system grew, took on the lead of backend development. I built the entire architecture with Java, Spring Boot and PostgreSQL: user and team registration with leadership transfer, competition enrollment with payments via Stripe and MercadoPago, a judge system with request and approval flow, protein scoring by flavor, appearance and texture with automatic ranking, media uploads on AWS S3, and a full admin panel with user, team and financial reports. The system is live, generating revenue, and serving hundreds of active users — and keeps growing.",
      },
      kalyfit: {
        title: "KalyFit",
        subtitle: "AI Weight Loss App",
        description:
          "KalyFit is a weight loss app that uses artificial intelligence to make nutritional tracking simple and personalized. I worked 100% on the backend — integrating the OpenAI API for calorie analysis from food photos and personalized diet generation based on each user's profile, while also building the full authentication system, Stripe subscription flow, and admin dashboard. The app is available on the Play Store and Apple Store.",
      },
      kobafit: {
        title: "KobaFit",
        subtitle: "Multi-Tenant Fitness Platform",
        description:
          "KobaFit is a multi-tenant SaaS fitness platform where gyms pay a monthly fee to have their own branded app. I worked 100% on the backend, building the entire multi-tenant architecture from scratch — each gym operates in a fully isolated environment, with workout management, anamnesis, execution history, and reporting. The SuperAdmin has a consolidated view across all tenants, including a financial dashboard. The platform serves gyms in Brazil and Argentina.",
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
