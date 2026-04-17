"use client"

import { useState, useEffect } from "react"
import { X, Zap } from "lucide-react"
import { useLang } from "@/lib/LangContext"

const messages = {
  pt: "Ative a aceleração de hardware no navegador para uma experiência mais fluida.",
  en: "Enable hardware acceleration in your browser for a smoother experience.",
}

export default function HardwareNotice() {
  const { lang } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem("hw-notice-dismissed")) {
      const show = setTimeout(() => setVisible(true), 2000)
      const hide = setTimeout(() => dismiss(), 7000)
      return () => { clearTimeout(show); clearTimeout(hide) }
    }
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem("hw-notice-dismissed", "1")
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-xs w-full animate-fade-in">
      <div className="flex items-start gap-3 bg-[var(--bg)] border border-[var(--purple-dark)]/40 rounded-xl px-4 py-3 shadow-xl shadow-black/30">
        <Zap size={15} className="text-[var(--purple-light)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--text)] opacity-75 leading-relaxed flex-1">
          {messages[lang]}
        </p>
        <button onClick={dismiss} className="text-[var(--text)] opacity-40 hover:opacity-80 transition-opacity shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
