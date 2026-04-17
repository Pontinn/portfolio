"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"

const skillsData = {
  backend: [
    { name: "Java", level: 95 },
    { name: "Spring Boot", level: 92 },
    { name: "PostgreSQL", level: 88 },
    { name: "REST APIs", level: 93 },
    { name: "JWT / Auth", level: 90 },
    { name: "Flyway", level: 80 },
  ],
  frontend: [
    { name: "React", level: 82 },
    { name: "Next.js", level: 78 },
    { name: "TypeScript", level: 80 },
    { name: "Tailwind CSS", level: 85 },
    { name: "Node.js", level: 75 },
  ],
  cloud: [
    { name: "AWS S3", level: 80 },
    { name: "Docker", level: 85 },
    { name: "CI/CD", level: 75 },
    { name: "Stripe", level: 88 },
    { name: "MercadoPago", level: 82 },
  ],
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width: `${level}%`,
        duration: 1,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: barRef.current,
          start: "top 85%",
        },
      }
    )
  }, [level, delay])

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text)] font-medium">{name}</span>
        <span className="text-[var(--purple-light)] opacity-70">{level}%</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-[var(--purple-dark)] to-[var(--purple-light)]"
          style={{ width: 0 }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".skill-card"),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    )
  }, [])

  const categories = [
    { key: "backend", label: t.skills.categories.backend, icon: "☕", skills: skillsData.backend },
    { key: "frontend", label: t.skills.categories.frontend, icon: "⚛️", skills: skillsData.frontend },
    { key: "cloud", label: t.skills.categories.cloud, icon: "☁️", skills: skillsData.cloud },
  ]

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6 bg-[var(--bg-secondary)]/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[var(--purple-light)]">{t.skills.title}</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map(({ key, label, icon, skills }) => (
            <div
              key={key}
              className="skill-card opacity-0 bg-[var(--bg)] border border-[var(--purple-dark)]/20 rounded-2xl p-6 hover:border-[var(--purple-mid)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--purple-dark)]/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-bold text-[var(--text)] text-lg">{label}</h3>
              </div>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 0.08} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {["OpenAI API", "Stripe Webhooks", "Spring Events", "Spring Cache", "Multi-tenant", "AWS", "Thymeleaf", "i18n"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--purple-dark)]/15 text-[var(--purple-light)] border border-[var(--purple-dark)]/30 rounded-full hover:bg-[var(--purple-dark)]/30 transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
