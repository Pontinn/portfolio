"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Decides when a project card should be in its "active" (transformed) state.
 * Desktop (hover: hover): pointerenter activates, pointerleave deactivates.
 * Touch (hover: none): an IntersectionObserver with the central band of the
 * viewport (rootMargin -40% top and bottom) activates the card when it crosses
 * the center and deactivates it when it leaves.
 */
export function useCardActivation<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [active, setActive] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia("(hover: none)")
    let touch = mq.matches
    setIsTouch(touch)

    const onEnter = () => { if (!touch) setActive(true) }
    const onLeave = () => { if (!touch) setActive(false) }
    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointerleave", onLeave)

    const io = new IntersectionObserver(
      (entries) => {
        if (!touch) return
        entries.forEach((entry) => setActive(entry.isIntersecting))
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    )
    io.observe(el)

    const onModeChange = (e: MediaQueryListEvent) => {
      touch = e.matches
      setIsTouch(touch)
      setActive(false)
    }
    mq.addEventListener("change", onModeChange)

    return () => {
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointerleave", onLeave)
      io.disconnect()
      mq.removeEventListener("change", onModeChange)
    }
  }, [ref])

  return { active, isTouch }
}
