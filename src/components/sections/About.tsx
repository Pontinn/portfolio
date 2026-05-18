"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLang } from "@/lib/LangContext"
import { getAge } from "@/lib/i18n"
import { MapPin, Briefcase, Calendar } from "lucide-react"
import BorderGlow from "@/components/ui/BorderGlow"
import DecryptedText from "@/components/ui/DecryptedText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const { t, lang } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      )

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const age = getAge()

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <DecryptedText
            text={t.about.title}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={120}
            maxIterations={20}
            className="text-[var(--purple-light)]"
            encryptedClassName="text-[var(--purple-mid)] opacity-70"
          />
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div ref={imageRef} className="opacity-0 flex justify-center">
            <div className="relative">
              <BorderGlow
                backgroundColor="var(--bg-secondary)"
                borderRadius={16}
                glowColor="280 90 75"
                colors={["#892CDC", "#BC6FF1", "#52057B"]}
                glowIntensity={1.2}
                edgeSensitivity={20}
                glowRadius={50}
              >
                <div className="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden rounded-2xl">
                  <Image
                    src="/imagem-profissional-sem-fundo-2.png"
                    alt="Leonardo Pontin"
                    fill
                    sizes="(max-width: 768px) 256px, 288px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </BorderGlow>
              <div className="absolute -bottom-4 -right-4 bg-[var(--purple-mid)] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg z-10">
                {age} {t.about.age}
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="opacity-0 space-y-6">
            <div className="space-y-2">
              <p className="text-[var(--purple-light)] font-semibold text-sm tracking-widest uppercase">
                {t.about.role}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text)] opacity-60">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-[var(--purple-mid)]" /> Brasil
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={14} className="text-[var(--purple-mid)]" /> Mave Company
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-[var(--purple-mid)]" /> +2 {lang === "pt" ? "anos de experiência" : "years of experience"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {t.about.bio.map((paragraph, i) => (
                <p key={i} className="text-[var(--text)] opacity-75 leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
