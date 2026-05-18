"use client"

import { MotionValue, motion, useSpring, useTransform } from "framer-motion"
import React, { useEffect, useMemo, useRef, useState } from "react"

type PlaceValue = number | "."

interface NumberProps {
  mv: MotionValue<number>
  number: number
  height: number
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) memo -= 10 * height
    return memo
  })

  return (
    <motion.span
      style={{
        y,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {number}
    </motion.span>
  )
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num)
  const tolerance = 1e-9 * Math.max(1, Math.abs(num))
  return Math.abs(num - nearest) < tolerance ? nearest : num
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place
  return Math.floor(normalizeNearInteger(scaled))
}

interface DigitProps {
  place: PlaceValue
  value: number
  height: number
  digitStyle?: React.CSSProperties
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const baseStyle: React.CSSProperties = {
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
    height,
    ...digitStyle,
  }

  const valueRoundedToPlace = getValueRoundedToPlace(value, place === "." ? 1 : place)
  const animatedValue = useSpring(valueRoundedToPlace, { stiffness: 80, damping: 22 })

  useEffect(() => {
    if (place === ".") return
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace, place])

  if (place === ".") {
    return <span style={{ ...baseStyle, width: "fit-content" }}>.</span>
  }

  return (
    <span style={baseStyle}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  )
}

interface CounterProps {
  value: number
  fontSize?: number
  padding?: number
  places?: PlaceValue[]
  gap?: number
  textColor?: string
  fontWeight?: React.CSSProperties["fontWeight"]
}

export default function Counter({
  value,
  fontSize = 20,
  padding = 0,
  places,
  gap = 0,
  textColor = "inherit",
  fontWeight = 700,
}: CounterProps) {
  const computedPlaces = useMemo<PlaceValue[]>(() => {
    if (places && places.length > 0) return places
    const digits = Math.max(1, value).toString().length
    return Array.from({ length: digits }, (_, i) => 10 ** (digits - i - 1))
  }, [places, value])

  const height = fontSize + padding

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          display: "flex",
          overflow: "hidden",
          lineHeight: 1,
          fontSize,
          gap,
          color: textColor,
          fontWeight,
          direction: "ltr",
        }}
      >
        {computedPlaces.map((place, i) => (
          <Digit key={`${i}-${place}`} place={place} value={value} height={height} />
        ))}
      </span>
    </span>
  )
}

export function AnimatedCounter({
  target,
  suffix,
  fontSize = 20,
  fontWeight = 700,
  textColor = "var(--purple-light)",
}: {
  target: number
  suffix?: string
  fontSize?: number
  fontWeight?: React.CSSProperties["fontWeight"]
  textColor?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const [triggered, setTriggered] = useState(false)

  const places = useMemo<PlaceValue[]>(() => {
    const digits = Math.max(1, target).toString().length
    return Array.from({ length: digits }, (_, i) => 10 ** (digits - i - 1))
  }, [target])

  useEffect(() => {
    if (!ref.current || triggered) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          setValue(target)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, triggered])

  return (
    <span ref={ref} style={{ display: "inline-flex", alignItems: "center" }}>
      <Counter
        value={value}
        places={places}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textColor={textColor}
      />
      {suffix && <span style={{ color: textColor, fontWeight, fontSize, marginLeft: 3 }}>{suffix}</span>}
    </span>
  )
}
