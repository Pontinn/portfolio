"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Globe, Menu, X } from "lucide-react"
import { useLang } from "@/lib/LangContext"
import { useTheme } from "@/lib/ThemeContext"

const sections = ["about", "skills", "experience", "projects", "contact"] as const

export default function Navbar() {
  const { lang, t, setLang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--purple-dark)]/30 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-white font-bold text-xl tracking-wide hover:opacity-80 transition-opacity font-mono"
        >
          pontin.dev<span className="animate-blink">|</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {sections.map((s) => (
            <li key={s}>
              <button
                onClick={() => scrollTo(s)}
                className="text-sm text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--purple-light)] transition-all duration-200"
              >
                {t.nav[s as keyof typeof t.nav]}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            title="Toggle language"
            className="flex items-center gap-1 text-xs font-medium text-[var(--text)] opacity-60 hover:opacity-100 hover:text-[var(--purple-light)] transition-all"
          >
            <Globe size={14} />
            {lang === "pt" ? "EN" : "PT"}
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="text-[var(--text)] opacity-60 hover:opacity-100 hover:text-[var(--purple-light)] transition-all"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="md:hidden text-[var(--text)] opacity-70"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--purple-dark)]/30 px-6 py-4 flex flex-col gap-3">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="text-left text-sm text-[var(--text)] opacity-70 hover:opacity-100 hover:text-[var(--purple-light)] transition-all py-1"
            >
              {t.nav[s as keyof typeof t.nav]}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
