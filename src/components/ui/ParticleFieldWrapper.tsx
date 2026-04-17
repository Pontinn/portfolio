"use client"

import dynamic from "next/dynamic"

const ParticleField = dynamic(() => import("@/components/ui/ParticleField"), {
  ssr: false,
})

export default function ParticleFieldWrapper() {
  return <ParticleField />
}
