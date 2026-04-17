"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { Briefcase } from "lucide-react"

export default function Experience() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".exp-item"),
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    )
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[var(--purple-light)]">{t.experience.title}</span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--purple-mid)] to-transparent" />

          <div className="space-y-10">
            {t.experience.items.map((item, i) => (
              <div key={i} className="exp-item opacity-0 relative flex gap-8 pl-16">
                {/* Dot */}
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-[var(--purple-mid)] border-2 border-[var(--bg)] -translate-x-1/2 shadow-lg shadow-[var(--purple-mid)]/50" />

                <div className="flex-1 bg-[var(--bg-secondary)]/40 border border-[var(--purple-dark)]/20 rounded-2xl p-6 hover:border-[var(--purple-mid)]/40 transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-[var(--text)] text-lg">{item.role}</h3>
                      <div className="flex items-center gap-2 text-[var(--purple-light)] text-sm font-medium">
                        <Briefcase size={13} />
                        {item.company}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text)] opacity-50 bg-[var(--purple-dark)]/15 px-3 py-1 rounded-full border border-[var(--purple-dark)]/20">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text)] opacity-65 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
