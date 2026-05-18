"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { Mail } from "lucide-react"
import DecryptedText from "@/components/ui/DecryptedText"
import BorderGlow from "@/components/ui/BorderGlow"
import DotField from "@/components/ui/DotField"

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
    <section id="contact" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(168, 85, 247, 0.35)"
          gradientTo="rgba(180, 151, 207, 0.25)"
          glowColor="#120F17"
        />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="contact-item opacity-0 text-3xl md:text-4xl font-bold mb-4">
          <DecryptedText
            text={t.contact.title}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={120}
            maxIterations={20}
            className="text-[var(--purple-light)]"
            encryptedClassName="text-[var(--purple-mid)] opacity-70"
          />
        </h2>
        <p className="contact-item opacity-0 text-xl md:text-2xl font-light text-[var(--text)] opacity-80 mb-3">
          {t.contact.subtitle}
        </p>
        <p className="contact-item opacity-0 text-sm text-[var(--text)] opacity-55 mb-12 max-w-md mx-auto">
          {t.contact.description}
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          {links.map(({ key, icon: Icon, href, display }) => (
            <div key={key} className="contact-item opacity-0">
              <BorderGlow
                backgroundColor="transparent"
                borderRadius={16}
                glowColor="280 90 75"
                colors={["#BC6FF1", "#892CDC", "#52057B"]}
                glowIntensity={1.3}
                edgeSensitivity={20}
                glowRadius={30}
              >
                <a
                  href={href}
                  target={key !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-[var(--purple-light)] to-[var(--purple-mid)] transition-all duration-300 hover:scale-[1.01] group"
                  style={{
                    boxShadow: "0 0 25px rgba(188, 111, 241, 0.45), 0 0 50px rgba(137, 44, 220, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-white/70 mb-0.5">
                        {t.contact[key as keyof typeof t.contact] ?? key}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {display}
                      </div>
                    </div>
                  </div>
                  <div className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </a>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center text-xs text-[var(--text)] opacity-25">
        © {new Date().getFullYear()} Leonardo Pontin
      </div>
    </section>
  )
}
