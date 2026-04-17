"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { ArrowDown, Mail } from "lucide-react"
import { useLang } from "@/lib/LangContext"
import { typingSignal } from "@/lib/typingSignal"

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin)
}

export default function Hero() {
  const { t } = useLang()
  const titleRef = useRef<HTMLSpanElement>(null)
  const titleRowRef = useRef<HTMLDivElement>(null)
  const greetRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Measure the typing row in screen space and push to signal as NDC coords
  useEffect(() => {
    if (!mounted) return
    function measure() {
      const el = titleRowRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      typingSignal.ndcX = (cx / window.innerWidth) * 2 - 1
      typingSignal.ndcY = -(( cy / window.innerHeight) * 2 - 1)
      typingSignal.ndcW = (rect.width / window.innerWidth)
      typingSignal.ndcH = Math.max(rect.height / window.innerHeight, 0.06)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    gsap.registerPlugin(TextPlugin)

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(greetRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(nameRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")

    return () => { tl.kill() }
  }, [mounted])

  useEffect(() => {
    if (!mounted || !titleRef.current) return

    const titles = t.hero.titles
    let i = 0
    let killed = false

    function typeNext() {
      if (killed) return
      const target = titles[i % titles.length]
      const totalChars = target.length

      typingSignal.phase = "typing"
      typingSignal.progress = 0

      gsap.to(titleRef.current, {
        duration: totalChars * 0.05,
        text: { value: target, delimiter: "" },
        ease: "none",
        onUpdate() {
          const current = titleRef.current?.textContent?.length ?? 0
          typingSignal.progress = current / totalChars
        },
        onComplete() {
          if (killed) return
          typingSignal.phase = "idle"
          typingSignal.progress = 1

          gsap.delayedCall(4, () => {
            if (killed) return
            typingSignal.phase = "erasing"

            gsap.to(titleRef.current, {
              duration: 0.4,
              opacity: 0,
              onUpdate() {
                // progress goes 1 → 0 as opacity fades
                typingSignal.progress = titleRef.current
                  ? parseFloat(gsap.getProperty(titleRef.current, "opacity") as string)
                  : 0
              },
              onComplete() {
                if (killed) return
                if (titleRef.current) titleRef.current.textContent = ""
                typingSignal.phase = "idle"
                typingSignal.progress = 0
                i++
                gsap.to(titleRef.current, {
                  duration: 0.3,
                  opacity: 1,
                  onComplete: () => {
                    if (killed) return
                    gsap.delayedCall(1.5, typeNext)
                  },
                })
              },
            })
          })
        },
      })
    }

    typeNext()
    return () => {
      killed = true
      gsap.killTweensOf(titleRef.current)
      typingSignal.phase = "idle"
      typingSignal.progress = 0
    }
  }, [mounted, t.hero.titles])

  function scrollToProjects() {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)] opacity-60 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div ref={greetRef} className="opacity-0 text-[var(--purple-light)] text-lg md:text-xl font-medium mb-3 tracking-wider">
          {t.hero.greeting}
        </div>

        <h1
          ref={nameRef}
          className="opacity-0 text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--text)] mb-6 leading-none"
        >
          {t.hero.name}
        </h1>

        <div ref={subtitleRef} className="opacity-0 mb-8">
          <div ref={titleRowRef} className="text-xl md:text-2xl lg:text-3xl font-light text-[var(--purple-mid)] min-h-[2rem]">
            <span ref={titleRef} />
            <span className="animate-pulse">|</span>
          </div>
          <a
            href="mailto:leo@pontin.dev"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--text)] opacity-50 hover:opacity-80 hover:text-[var(--purple-light)] transition-all duration-200 cursor-pointer"
          >
            <Mail size={14} />
            {t.hero.contact}
          </a>
        </div>

        <div ref={ctaRef} className="opacity-0 flex flex-col items-center gap-4">
          <button
            onClick={scrollToProjects}
            className="cursor-pointer px-8 py-3 bg-[var(--purple-mid)] hover:bg-[var(--purple-dark)] text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--purple-mid)]/30"
          >
            {t.hero.cta}
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[var(--text)] opacity-30">
        <ArrowDown size={20} />
      </div>
    </section>
  )
}
