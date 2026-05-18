"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { Briefcase } from "lucide-react"
import BorderGlow from "@/components/ui/BorderGlow"
import DecryptedText from "@/components/ui/DecryptedText"

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

    sectionRef.current.querySelectorAll(".timeline-dot").forEach((dot, i) => {
      gsap.to(dot, {
        y: -6,
        duration: 1.8 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.7,
      })
    })
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <DecryptedText
            text={t.experience.title}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={120}
            maxIterations={20}
            className="text-[var(--purple-light)]"
            encryptedClassName="text-[var(--purple-mid)] opacity-70"
          />
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--purple-mid)] to-transparent" />

          <div className="space-y-10">
            {t.experience.items.map((item, i) => (
              <div key={i} className="exp-item opacity-0 relative flex gap-8 pl-16">
                {/* Dot */}
                <div className="timeline-dot absolute left-4 top-1 w-4 h-4 rounded-full bg-[var(--purple-mid)] border-2 border-[var(--bg)] -translate-x-1/2 shadow-lg shadow-[var(--purple-mid)]/50" />

                <div className="flex-1">
                  <BorderGlow
                    backgroundColor="#0f0f0f"
                    borderRadius={16}
                    glowColor="280 80 70"
                    colors={["#892CDC", "#BC6FF1", "#52057B"]}
                  >
                    <div className="p-6">
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
                  </BorderGlow>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
