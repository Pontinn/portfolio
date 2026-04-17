"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { ExternalLink, Star, Lock } from "lucide-react"

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
}

const pitmasterStack = ["Java 17", "Spring Boot", "PostgreSQL", "AWS S3", "Stripe", "MercadoPago", "JWT", "Docker", "Flyway"]
const kalyfitStack = ["Java", "Spring Boot", "PostgreSQL", "OpenAI API", "Stripe", "Docker", "JWT"]
const kobafitStack = ["Java", "Spring Boot", "PostgreSQL", "Multi-tenant", "Stripe", "Docker", "JWT"]

function Badge({ text }: { text: string }) {
  return (
    <span className="px-2 py-0.5 text-xs bg-[var(--purple-dark)]/20 text-[var(--purple-light)] border border-[var(--purple-dark)]/30 rounded-md">
      {text}
    </span>
  )
}

function RepoCard({ repo, noDesc }: { repo: GitHubRepo; noDesc: string }) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
        },
      }
    )
  }, [])

  return (
    <a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-[var(--purple-dark)]/20 bg-[var(--bg)] p-4 hover:border-[var(--purple-mid)]/40 transition-all duration-300 hover:shadow-md hover:shadow-[var(--purple-dark)]/10"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--purple-light)] transition-colors">
          {repo.name}
        </span>
        <ExternalLink size={13} className="text-[var(--text)] opacity-30 group-hover:opacity-70 mt-0.5 flex-shrink-0" />
      </div>
      <p className="text-xs text-[var(--text)] opacity-55 mb-3 line-clamp-2 leading-relaxed">
        {repo.description || noDesc}
      </p>
      <div className="flex items-center gap-3 text-xs text-[var(--text)] opacity-45">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--purple-mid)]" />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star size={11} />
            {repo.stargazers_count}
          </span>
        )}
      </div>
    </a>
  )
}

export default function Projects() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setRepos(data as GitHubRepo[])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".proj-card"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    )
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-6 bg-[var(--bg-secondary)]/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[var(--purple-light)]">{t.projects.title}</span>
        </h2>

        {/* Pitmaster — destaque */}
        <div className="proj-card opacity-0 mb-10 group relative rounded-3xl border border-[var(--purple-mid)]/40 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--purple-dark)]/10 p-8 hover:border-[var(--purple-mid)]/70 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--purple-dark)]/20">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t.projects.inProduction}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[var(--purple-light)] text-xs font-semibold tracking-widest uppercase mb-2">
                Destaque
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-1">
                {t.projects.pitmaster.title}
              </h3>
              <p className="text-[var(--purple-mid)] font-medium mb-4">
                {t.projects.pitmaster.subtitle}
              </p>
              <p className="text-sm text-[var(--text)] opacity-70 leading-relaxed mb-6">
                {t.projects.pitmaster.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--text)] opacity-50">
                <Lock size={12} />
                {t.projects.privateRepo}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Usuários", value: "100+" },
                  { label: "Gateways", value: "2" },
                  { label: "Migrations", value: "57+" },
                  { label: "Status", value: "Live 🔴" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[var(--bg)]/60 border border-[var(--purple-dark)]/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[var(--purple-light)]">{stat.value}</div>
                    <div className="text-xs text-[var(--text)] opacity-50">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {pitmasterStack.map((s) => <Badge key={s} text={s} />)}
              </div>
            </div>
          </div>
        </div>

        {/* KalyFit + KobaFit */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: t.projects.kalyfit.title,
              subtitle: t.projects.kalyfit.subtitle,
              description: t.projects.kalyfit.description,
              stack: kalyfitStack,
              badge: t.projects.liveApp,
              badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
            },
            {
              title: t.projects.kobafit.title,
              subtitle: t.projects.kobafit.subtitle,
              description: t.projects.kobafit.description,
              stack: kobafitStack,
              badge: t.projects.inProduction,
              badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
            },
          ].map((proj) => (
            <div
              key={proj.title}
              className="proj-card opacity-0 relative rounded-2xl border border-[var(--purple-dark)]/25 bg-[var(--bg)] p-6 hover:border-[var(--purple-mid)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple-dark)]/15"
            >
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${proj.badgeColor}`}>
                  {proj.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text)] mb-1 pr-28">{proj.title}</h3>
              <p className="text-[var(--purple-mid)] text-sm font-medium mb-3">{proj.subtitle}</p>
              <p className="text-xs text-[var(--text)] opacity-65 leading-relaxed mb-4">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.stack.map((s) => <Badge key={s} text={s} />)}
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--text)] opacity-40">
                <Lock size={11} />
                {t.projects.privateRepo}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub repos */}
        {repos.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-[var(--text)] opacity-70 mb-5 flex items-center gap-2">
              <GithubIcon size={18} />
              {t.projects.github.title}
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} noDesc={t.projects.github.noDescription} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
