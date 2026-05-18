"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import BorderGlow from "@/components/ui/BorderGlow"
import {
  SiSpringboot, SiSpringsecurity, SiPostgresql, SiDocker,
  SiStripe, SiReact, SiNextdotjs,
  SiTypescript, SiTailwindcss, SiNodedotjs, SiGit,
  SiOpenai, SiNginx, SiGithubactions, SiThymeleaf,
  SiApachemaven, SiHibernate, SiMercadopago, SiJunit5,
} from "react-icons/si"
import { Database, Cloud, Coffee } from "lucide-react"

type AnyIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties }>
type Tech = { name: string; icon: AnyIcon; color: string }

const row1: Tech[] = [
  { name: "Java",            icon: Coffee,           color: "#f89820" },
  { name: "Spring Boot",     icon: SiSpringboot,     color: "#6db33f" },
  { name: "Spring Security", icon: SiSpringsecurity, color: "#6db33f" },
  { name: "PostgreSQL",      icon: SiPostgresql,     color: "#336791" },
  { name: "Flyway",          icon: Database,         color: "#cc0200" },
  { name: "Hibernate",       icon: SiHibernate,      color: "#59666c" },
  { name: "Docker",          icon: SiDocker,         color: "#2496ed" },
  { name: "AWS",             icon: Cloud,            color: "#ff9900" },
  { name: "Nginx",           icon: SiNginx,          color: "#009639" },
  { name: "Maven",           icon: SiApachemaven,    color: "#c71a36" },
  { name: "JUnit 5",         icon: SiJunit5,         color: "#25a162" },
]

const row2: Tech[] = [
  { name: "React",           icon: SiReact,          color: "#61dafb" },
  { name: "Next.js",         icon: SiNextdotjs,      color: "#ffffff" },
  { name: "TypeScript",      icon: SiTypescript,     color: "#3178c6" },
  { name: "Tailwind CSS",    icon: SiTailwindcss,    color: "#38bdf8" },
  { name: "Node.js",         icon: SiNodedotjs,      color: "#339933" },
  { name: "Git",             icon: SiGit,            color: "#f05032" },
  { name: "GitHub Actions",  icon: SiGithubactions,  color: "#2088ff" },
  { name: "Stripe",          icon: SiStripe,         color: "#635bff" },
  { name: "MercadoPago",     icon: SiMercadopago,    color: "#009ee3" },
  { name: "OpenAI API",      icon: SiOpenai,         color: "#74aa9c" },
  { name: "Thymeleaf",       icon: SiThymeleaf,      color: "#005f0f" },
]

function TechBadge({ tech }: { tech: Tech }) {
  const Icon = tech.icon
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--purple-dark)]/25 bg-[var(--bg-secondary)]/60 backdrop-blur-sm whitespace-nowrap select-none shrink-0 hover:border-[var(--purple-mid)]/50 transition-colors duration-300">
      <Icon size={16} style={{ color: tech.color }} />
      <span className="text-sm font-medium text-[var(--text)]/80">{tech.name}</span>
    </div>
  )
}

function MarqueeRow({ items, reverse = false, duration = 35 }: { items: Tech[]; reverse?: boolean; duration?: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [copyWidth, setCopyWidth] = useState(0)
  const quadrupled = [...items, ...items, ...items, ...items]

  useEffect(() => {
    if (!trackRef.current) return
    const children = trackRef.current.children
    if (children.length <= items.length) return
    const firstCopy2 = children[items.length] as HTMLElement
    setCopyWidth(firstCopy2.offsetLeft)
  }, [items.length])

  const animateKeys = reverse ? [-copyWidth, 0] : [0, -copyWidth]

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        ref={trackRef}
        style={{ display: "flex", width: "max-content" }}
        animate={copyWidth > 0 ? { x: animateKeys } : {}}
        transition={copyWidth > 0 ? {
          x: { duration, ease: "linear", repeat: Infinity, repeatType: "loop" },
        } : {}}
      >
        {quadrupled.map((tech, i) => (
          <div key={`${tech.name}-${i}`} style={{ marginRight: "12px" }}>
            <TechBadge tech={tech} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function TechMarquee() {
  return (
    <section className="py-14 w-full overflow-x-hidden">
      <BorderGlow
        backgroundColor="#101010"
        borderRadius={0}
        glowColor="280 80 70"
        colors={["#892CDC", "#BC6FF1", "#52057B"]}
        edgeSensitivity={20}
        className="no-side-borders marquee-glow"
      >
        <div className="py-8 overflow-x-hidden space-y-3">
          <MarqueeRow items={row1} duration={40} />
          <MarqueeRow items={row2} reverse duration={35} />
        </div>
      </BorderGlow>
    </section>
  )
}
