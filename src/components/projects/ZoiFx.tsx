"use client"

import { useEffect, useRef, type RefObject } from "react"
import { useLang } from "@/lib/LangContext"

// Real palette of the app (10 slots, hsl(H 100% L%))
const SLOTS: Array<[number, number]> = [[20, 62], [52, 62], [85, 62], [117, 62], [150, 62], [182, 62], [215, 62], [247, 72], [280, 68], [312, 62]]
const fill = (slot: number) => `hsl(${SLOTS[slot][0]} 100% ${SLOTS[slot][1]}%)`
const soft = (slot: number) => `hsl(${SLOTS[slot][0]} 100% 50% / 0.15)`

// Viewer pointers are named after the other projects of the portfolio
const VIEWERS: Array<[string, number]> = [["Pitmasters", 0], ["Pontindex", 6], ["Experio", 4], ["KobaFit", 9]]
const ME_SLOT = 8
const STREAM_META = "1080p60 · AV1 · P2P"

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const rndi = (a: number, b: number) => Math.floor(rnd(a, b + 1))

function Arrow({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M2 1 L2 14.2 L5.3 11 L7.4 15.4 L9.9 14.2 L7.8 9.9 L12 9.6 Z"
        fill={color}
        stroke="#0e0b12"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cursor({ name, slot, me, cursorRef }: { name: string; slot: number; me?: boolean; cursorRef: (el: HTMLDivElement | null) => void }) {
  const color = fill(slot)
  return (
    <div ref={cursorRef} className={`tc-cursor tc-cursor-enter${me ? " tc-cursor-me" : ""}`} style={me ? { opacity: 0 } : undefined}>
      <Arrow color={color} />
      <span style={{ color, borderColor: color }}>{name}</span>
    </div>
  )
}

interface ZoiFxProps {
  on: boolean
  /** false under prefers-reduced-motion: no pointers */
  fxEnabled: boolean
  /** the visitor's own "you" pointer (desktop only) */
  showMe: boolean
  /** element that receives the pointermove for the "you" pointer */
  hostRef: RefObject<HTMLElement | null>
}

/**
 * Zoi da Goiaba active-state effects: the card becomes the screen of a live
 * room. LIVE pill + avatars + stream meta, the floating guava logo, four viewer
 * pointers wandering around (sometimes idle and fading, like the app) and the
 * visitor's own pointer following the mouse.
 */
export default function ZoiFx({ on, fxEnabled, showMe, hostRef }: ZoiFxProps) {
  const { t } = useLang()
  const layerRef = useRef<HTMLDivElement>(null)
  const botRefs = useRef<Array<HTMLDivElement | null>>([])
  const meRef = useRef<HTMLDivElement | null>(null)
  const showPointers = on && fxEnabled
  const showMePointer = showPointers && showMe

  // viewer pointers: each one walks at its own pace; sometimes stops and fades (idle)
  useEffect(() => {
    if (!showPointers) return
    const timers: number[] = []
    let alive = true

    VIEWERS.forEach((_, i) => {
      const el = botRefs.current[i]
      if (!el) return
      el.style.transform = `translate(${rnd(10, 60)}%, ${rnd(20, 70)}%)`
      let idle = false
      const tick = () => {
        if (!alive) return
        if (Math.random() < 0.12 && !idle) {
          idle = true
          el.classList.add("tc-cursor-idle")
          timers.push(window.setTimeout(tick, rndi(1200, 2200)))
          return
        }
        if (idle) {
          idle = false
          el.classList.remove("tc-cursor-idle")
        }
        const layer = layerRef.current
        if (layer) {
          const r = layer.getBoundingClientRect()
          const x = rnd(0.04, 0.82) * r.width
          const y = rnd(0.12, 0.85) * r.height
          el.style.transform = `translate(${x}px, ${y}px)`
        }
        timers.push(window.setTimeout(tick, rndi(900, 1800)))
      }
      timers.push(window.setTimeout(tick, 200 + i * 180))
    })

    return () => {
      alive = false
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [showPointers])

  // the visitor's own pointer follows the mouse inside the card
  useEffect(() => {
    const host = hostRef.current
    if (!showMePointer || !host) return
    const onMove = (e: PointerEvent) => {
      const me = meRef.current
      const layer = layerRef.current
      if (!me || !layer) return
      const r = layer.getBoundingClientRect()
      // the card is scaled while active: convert viewport px to the layer's own px
      const sx = r.width ? layer.offsetWidth / r.width : 1
      const sy = r.height ? layer.offsetHeight / r.height : 1
      me.style.opacity = "1"
      me.style.transform = `translate(${(e.clientX - r.left) * sx - 2}px, ${(e.clientY - r.top) * sy - 1}px)`
    }
    host.addEventListener("pointermove", onMove)
    return () => host.removeEventListener("pointermove", onMove)
  }, [showMePointer, hostRef])

  const avatars: Array<[string, number]> = [...VIEWERS, [t.projects.you, ME_SLOT]]

  return (
    <>
      <div className="tc-goiaba" aria-hidden="true" />
      <div className="tc-live" aria-hidden="true">
        <span className="tc-live-rec"><i />{t.projects.live}</span>
        <span className="tc-avatars">
          {avatars.map(([name, slot]) => (
            <b key={name} style={{ color: fill(slot), background: soft(slot) }}>{name[0].toUpperCase()}</b>
          ))}
        </span>
        <span className="tc-live-meta">{STREAM_META}</span>
      </div>
      <div className="tc-cursors" ref={layerRef} aria-hidden="true">
        {showPointers && VIEWERS.map(([name, slot], i) => (
          <Cursor key={name} name={name} slot={slot} cursorRef={(el) => { botRefs.current[i] = el }} />
        ))}
        {showMePointer && (
          <Cursor name={t.projects.you} slot={ME_SLOT} me cursorRef={(el) => { meRef.current = el }} />
        )}
      </div>
    </>
  )
}
