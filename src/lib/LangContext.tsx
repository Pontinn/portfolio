"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type Lang, detectLanguage, translations } from "./i18n"

type LangContextType = {
  lang: Lang
  t: (typeof translations)["pt"] | (typeof translations)["en"]
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  t: translations.en,
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null
    if (stored === "pt" || stored === "en") {
      setLangState(stored)
    } else {
      detectLanguage().then(setLangState)
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
