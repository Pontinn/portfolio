"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export type CardSoundName = "pontindexOn" | "pontindexOff" | "zoiOn" | "zoiOff"

const SOUND_SRC: Record<CardSoundName, string> = {
  pontindexOn: "/projects/pontindex/pokedex_open.ogg",
  pontindexOff: "/projects/pontindex/pokedex_close.ogg",
  zoiOn: "/projects/zoi/discord_join.mp3",
  zoiOff: "/projects/zoi/discord_leave.mp3",
}

const SOUND_VOLUME = 0.5
const STYLE_APPLY_DELAY_MS = 70 // the style switch lands at the peak of the flash
const SWITCH_END_MS = 400 // shake (380 ms) is over by then

let sounds: Record<CardSoundName, HTMLAudioElement> | null = null
let soundsUnlocked = false
let warmUpBound = false

function getSounds() {
  if (typeof window === "undefined") return null
  if (!sounds) {
    const entries = Object.entries(SOUND_SRC).map(([name, src]) => {
      const audio = new Audio(src)
      audio.preload = "auto"
      audio.volume = SOUND_VOLUME
      return [name, audio] as const
    })
    sounds = Object.fromEntries(entries) as Record<CardSoundName, HTMLAudioElement>
  }
  return sounds
}

/** Plays a card sound. Fails silently while the browser still blocks autoplay. */
export function playCardSound(name: CardSoundName) {
  const all = getSounds()
  if (!all) return
  const audio = all[name]
  try {
    audio.currentTime = 0
    audio.play().then(() => { soundsUnlocked = true }).catch(() => {})
  } catch {
    // never throw because of audio
  }
}

/**
 * Browsers only allow audio after a real gesture on the page (hover and scroll
 * do not count). On the first pointerdown we play every sound muted and pause
 * it right away, so the later real plays are allowed.
 */
export function bindCardSoundWarmUp() {
  if (warmUpBound || typeof window === "undefined") return
  warmUpBound = true
  window.addEventListener(
    "pointerdown",
    () => {
      if (soundsUnlocked) return
      const all = getSounds()
      if (!all) return
      Object.values(all).forEach((audio) => {
        audio.muted = true
        audio
          .play()
          .then(() => {
            audio.pause()
            audio.currentTime = 0
            audio.muted = false
            soundsUnlocked = true
          })
          .catch(() => { audio.muted = false })
      })
    },
    { once: true }
  )
}

interface SwitchFxOptions {
  /** Element that shakes; it also scopes the flash animation (class "tc-switching"). */
  shakeRef: RefObject<HTMLElement | null>
  sounds: { on: CardSoundName; off: CardSoundName }
  /** false under prefers-reduced-motion: no flash, no shake, no sound, style switches at once. */
  enabled: boolean
}

/**
 * The state switch shared by both cards: white flash (260 ms, peak at 25%) plus
 * a shake (380 ms), sound playing along, and the actual style change 70 ms after
 * the start. Returns the applied "on" state, which lags the desired state by
 * those 70 ms.
 */
export function useSwitchFx(desired: boolean, { shakeRef, sounds: soundNames, enabled }: SwitchFxOptions) {
  const [on, setOn] = useState(false)
  const onRef = useRef(false)
  const pendingRef = useRef<"on" | "off" | "">("")
  const timersRef = useRef<{ apply?: number; end?: number }>({})

  useEffect(() => {
    if (desired) {
      if (onRef.current || pendingRef.current === "on") return
      pendingRef.current = "on"
    } else {
      if (!onRef.current && pendingRef.current !== "on") return
      pendingRef.current = "off"
    }

    const timers = timersRef.current
    window.clearTimeout(timers.apply)
    window.clearTimeout(timers.end)

    const shakeEl = shakeRef.current
    if (enabled) {
      playCardSound(desired ? soundNames.on : soundNames.off)
      if (shakeEl) {
        // restart the flash + shake animation from the beginning
        shakeEl.classList.remove("tc-switching")
        void shakeEl.offsetWidth
        shakeEl.classList.add("tc-switching")
      }
    }

    timers.apply = window.setTimeout(() => {
      pendingRef.current = ""
      onRef.current = desired
      setOn(desired)
    }, enabled ? STYLE_APPLY_DELAY_MS : 0)
    timers.end = window.setTimeout(() => {
      shakeEl?.classList.remove("tc-switching")
    }, SWITCH_END_MS)
  }, [desired, enabled, shakeRef, soundNames.on, soundNames.off])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      window.clearTimeout(timers.apply)
      window.clearTimeout(timers.end)
    }
  }, [])

  return on
}
