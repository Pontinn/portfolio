"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"

const SPRITES_PATH = "/projects/pontindex/sprites/"
// 10 famous Pokemon (national Pokedex IDs): Pikachu, Charizard, Bulbasaur, Charmander,
// Squirtle, Eevee, Mewtwo, Snorlax, Gengar, Lucario
const FAMOUS = [25, 6, 1, 4, 7, 133, 150, 143, 94, 448]
const EDGES = ["left", "right", "top", "bottom"] as const
const PLACEMENT_ATTEMPTS = 12
const GAP_PX = 6
// concurrent sprites and sizes: lighter on phones (viewports below 768px)
const MAX_ON_STAGE_DESKTOP = 5
const MAX_ON_STAGE_MOBILE = 3
const SIZE_RANGE_DESKTOP: [number, number] = [110, 160]
const SIZE_RANGE_MOBILE: [number, number] = [96, 130]

type Rect = { l: number; t: number; r: number; b: number }

type Peek = {
  key: number
  id: number
  size: number
  left: number
  top: number
  ox: string
  oy: string
  rot: string
  life: number
  front: boolean
  flip: boolean
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const rndi = (a: number, b: number) => Math.floor(rnd(a, b + 1))

interface PontindexFxProps {
  on: boolean
  /** false under prefers-reduced-motion: no sprites at all */
  fxEnabled: boolean
}

/**
 * Pontindex active-state effects: the spinning Pokeball and the Pokemon peeking
 * through the edges of the card (rules from the IDEA: only the 10 famous ones,
 * never the same one twice at the same time, never covering each other, head
 * pointing to the center, 65 to 85% of the body inside).
 */
export default function PontindexFx({ on, fxEnabled }: PontindexFxProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [peeks, setPeeks] = useState<Peek[]>([])
  const onStage = useRef(new Set<number>()) // IDs visible now
  const occupied = useRef(new Map<number, Rect>()) // id -> resting rectangle
  const keyRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const removePeek = useCallback((key: number, id: number) => {
    onStage.current.delete(id)
    occupied.current.delete(id)
    setPeeks((prev) => prev.filter((p) => p.key !== key))
  }, [])

  const spawnPeek = useCallback(() => {
    const layer = layerRef.current
    if (!layer) return
    const width = layer.offsetWidth
    const height = layer.offsetHeight
    const count = Math.random() < 0.3 ? 2 : 1
    const born: Peek[] = []
    const mobile = window.matchMedia("(max-width: 767px)").matches
    const maxOnStage = mobile ? MAX_ON_STAGE_MOBILE : MAX_ON_STAGE_DESKTOP
    const [minSize, maxSize] = mobile ? SIZE_RANGE_MOBILE : SIZE_RANGE_DESKTOP

    for (let i = 0; i < count; i++) {
      if (onStage.current.size >= maxOnStage) break
      const free = FAMOUS.filter((id) => !onStage.current.has(id))
      if (!free.length) break
      const id = free[rndi(0, free.length - 1)]
      onStage.current.add(id)
      const size = rndi(minSize, maxSize)
      // always on an edge: 65 to 85% of the body comes in (face always visible)
      const half = size * rnd(0.15, 0.35)

      let slot: { rect: Rect; ox: string; oy: string; rot: string } | null = null
      for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS && !slot; attempt++) {
        const edge = EDGES[rndi(0, 3)]
        let x = 0
        let y = 0
        let ox = "0px"
        let oy = "0px"
        let rot = "0deg" // head always pointing to the center of the card
        if (edge === "left") { x = -half; y = rnd(8, height - size - 8); ox = "-110%"; rot = "90deg" }
        if (edge === "right") { x = width - size + half; y = rnd(8, height - size - 8); ox = "110%"; rot = "-90deg" }
        if (edge === "top") { y = -half; x = rnd(8, width - size - 8); oy = "-110%"; rot = "180deg" }
        if (edge === "bottom") { y = height - size + half; x = rnd(8, width - size - 8); oy = "110%" }
        const rect: Rect = { l: x, t: y, r: x + size, b: y + size }
        const crosses = [...occupied.current.values()].some(
          (o) => rect.l < o.r + GAP_PX && rect.r > o.l - GAP_PX && rect.t < o.b + GAP_PX && rect.b > o.t - GAP_PX
        )
        if (!crosses) slot = { rect, ox, oy, rot }
      }
      if (!slot) {
        // no free slot: skip this round
        onStage.current.delete(id)
        break
      }
      occupied.current.set(id, slot.rect)
      born.push({
        key: ++keyRef.current,
        id,
        size,
        left: slot.rect.l,
        top: slot.rect.t,
        ox: slot.ox,
        oy: slot.oy,
        rot: slot.rot,
        life: rndi(3000, 4200),
        front: Math.random() >= 0.55,
        flip: Math.random() < 0.5,
      })
    }

    if (born.length) setPeeks((prev) => [...prev, ...born])
  }, [])

  useEffect(() => {
    if (!on || !fxEnabled) {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = null
      onStage.current.clear()
      occupied.current.clear()
      setPeeks([])
      return
    }
    spawnPeek()
    const loop = () => {
      timerRef.current = window.setTimeout(() => {
        spawnPeek()
        loop()
      }, rndi(800, 1400))
    }
    loop()
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [on, fxEnabled, spawnPeek])

  return (
    <>
      <div className="tc-pokeball" aria-hidden="true" />
      <div className="tc-peeks" ref={layerRef} aria-hidden="true">
        {peeks.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.key}
            src={`${SPRITES_PATH}${p.id}.png`}
            alt=""
            draggable={false}
            className={`tc-peek ${p.front ? "tc-peek-front" : "tc-peek-back"}${p.flip ? " tc-peek-flip" : ""}`}
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              "--ox": p.ox,
              "--oy": p.oy,
              "--rot": p.rot,
              "--life": `${p.life}ms`,
            } as CSSProperties}
            onAnimationEnd={() => removePeek(p.key, p.id)}
            onError={() => removePeek(p.key, p.id)}
          />
        ))}
      </div>
    </>
  )
}
