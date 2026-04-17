"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { Mail } from "lucide-react"

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const links = [
  {
    key: "email",
    icon: Mail,
    label: "Email",
    href: "mailto:leo@pontin.dev",
    display: "leo@pontin.dev",
    color: "hover:text-[var(--purple-light)]",
  },
  {
    key: "linkedin",
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leonardo-pontin-b6a432317/",
    display: "linkedin.com/in/leonardo-pontin",
    color: "hover:text-blue-400",
  },
  {
    key: "github",
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/Pontinn",
    display: "github.com/Pontinn",
    color: "hover:text-gray-300",
  },
]

export default function Contact() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".contact-item"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      }
    )
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="contact-item opacity-0 text-3xl md:text-4xl font-bold mb-4">
          <span className="text-[var(--purple-light)]">{t.contact.title}</span>
        </h2>
        <p className="contact-item opacity-0 text-xl md:text-2xl font-light text-[var(--text)] opacity-80 mb-3">
          {t.contact.subtitle}
        </p>
        <p className="contact-item opacity-0 text-sm text-[var(--text)] opacity-55 mb-12 max-w-md mx-auto">
          {t.contact.description}
        </p>

        <div className="space-y-4">
          {links.map(({ key, icon: Icon, href, display, color }) => (
            <a
              key={key}
              href={href}
              target={key !== "email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`contact-item opacity-0 flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-[var(--purple-dark)]/20 bg-[var(--bg-secondary)]/30 hover:border-[var(--purple-mid)]/50 hover:bg-[var(--bg-secondary)]/60 transition-all duration-300 group ${color}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--purple-dark)]/20 flex items-center justify-center group-hover:bg-[var(--purple-dark)]/40 transition-colors">
                  <Icon size={18} className="text-[var(--purple-mid)] group-hover:text-[var(--purple-light)] transition-colors" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-[var(--text)] opacity-40 mb-0.5">
                    {t.contact[key as keyof typeof t.contact] ?? key}
                  </div>
                  <div className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--purple-light)] transition-colors">
                    {display}
                  </div>
                </div>
              </div>
              <div className="text-[var(--text)] opacity-30 group-hover:opacity-70 transition-opacity">
                →
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center text-xs text-[var(--text)] opacity-25">
        © {new Date().getFullYear()} Leonardo Pontin
      </div>
    </section>
  )
}
