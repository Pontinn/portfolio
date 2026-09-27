"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import BorderGlow from "@/components/ui/BorderGlow"
import PontindexFx from "./PontindexFx"
import ZoiFx from "./ZoiFx"
import { useCardActivation } from "./useCardActivation"
import { bindCardSoundWarmUp, useSwitchFx, type CardSoundName } from "./useSwitchFx"
import "./TransformCard.css"

export type TransformCardVariant = "pontindex" | "zoi"

interface VariantTheme {
  glowColor: string
  colors: string[]
  backgroundColor: string
  sounds: { on: CardSoundName; off: CardSoundName }
}

// Normal state = exactly the card of today (purple BorderGlow). Only the active state changes.
const NORMAL_GLOW = { glowColor: "280 80 70", colors: ["#892CDC", "#BC6FF1", "#52057B"], backgroundColor: "var(--bg)" }

const VARIANT_THEME: Record<TransformCardVariant, VariantTheme> = {
  pontindex: {
    glowColor: "0 0 100", // white interactive border
    colors: ["#ffffff", "#ffffff", "#ffffff"],
    backgroundColor: "#DC0A2D", // Pontindex classic red
    sounds: { on: "pontindexOn", off: "pontindexOff" },
  },
  zoi: {
    glowColor: "276 100 62", // #b23dff, accent-hover of the app
    colors: ["#b23dff", "#b23dff", "#b23dff"],
    backgroundColor: "#0e0b12", // bg-app; the gradient sits on the .tc-bg layer
    sounds: { on: "zoiOn", off: "zoiOff" },
  },
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

interface TransformCardProps {
  variant: TransformCardVariant
  children: ReactNode
  className?: string
}

/**
 * A project card that "becomes another card" when the visitor interacts with it
 * (hover on desktop, central band of the viewport on touch). Wraps the same
 * BorderGlow + content of the other cards and adds the themed layers on top.
 */
export default function TransformCard({ variant, children, className = "" }: TransformCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const shakeRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const theme = VARIANT_THEME[variant]
  const { active, isTouch } = useCardActivation(rootRef)
  const on = useSwitchFx(active, { shakeRef, sounds: theme.sounds, enabled: !reducedMotion })
  const fxEnabled = !reducedMotion

  useEffect(() => { bindCardSoundWarmUp() }, [])

  const glow = on ? theme : NORMAL_GLOW

  return (
    <div
      ref={rootRef}
      className={`tc tc-${variant}${on ? " tc-on" : ""} ${className}`}
      data-card={variant}
      data-active={on ? "true" : "false"}
    >
      <div ref={shakeRef} className="tc-shake">
        <BorderGlow
          className="h-full"
          backgroundColor={glow.backgroundColor}
          borderRadius={16}
          glowColor={glow.glowColor}
          colors={glow.colors}
        >
          <div className="tc-bg" aria-hidden="true" />
          <div className="tc-scan" aria-hidden="true" />
          {variant === "pontindex" ? (
            <PontindexFx on={on} fxEnabled={fxEnabled} />
          ) : (
            <ZoiFx on={on} fxEnabled={fxEnabled} showMe={!isTouch} hostRef={rootRef} />
          )}
          {children}
          <div className="tc-flash" aria-hidden="true" />
        </BorderGlow>
      </div>
    </div>
  )
}
