"use client"

import { useRef, useEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { typingSignal } from "@/lib/typingSignal"

const PARTICLE_COUNT = 3000
const SAMPLE_STEP = 4
const FOV_RAD = (55 / 2) * (Math.PI / 180)
const CAM_Z = 5

// Continuous scroll progress — updated every scroll event
// 0 = hero, 0..1 = transitioning to about, 1 = about settled, 2 = skills+
const scrollSignal = { t: 0 }

// Global mouse — fires even when cursor is over text/buttons
const globalMouse = { x: 0, y: 0 }
if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      globalMouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true }
  )
}

// ─── Target generators ────────────────────────────────────────────────────────

function sampleImageParticles(img: HTMLImageElement, count: number): Float32Array {
  const canvas = document.createElement("canvas")
  const scale = 0.4
  canvas.width = Math.floor(img.naturalWidth * scale)
  canvas.height = Math.floor(img.naturalHeight * scale)
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

  const candidates: [number, number][] = []
  for (let y = 0; y < canvas.height; y += SAMPLE_STEP) {
    for (let x = 0; x < canvas.width; x += SAMPLE_STEP) {
      const idx = (y * canvas.width + x) * 4
      if (data[idx + 3] > 60) candidates.push([x, y])
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  const picked = candidates.slice(0, count)
  const aspect = canvas.height / canvas.width
  const out = new Float32Array(count * 3)
  for (let i = 0; i < picked.length; i++) {
    const [px, py] = picked[i]
    out[i * 3] = (px / canvas.width - 0.5) * 3
    out[i * 3 + 1] = -(py / canvas.height - 0.5) * 3 * aspect
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.3
  }
  return out
}

// Portrait cluster on the LEFT — behind the About photo
function generatePhotoCluster(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random())
    out[i * 3] = -1.6 + Math.cos(angle) * r * 1.0
    out[i * 3 + 1] = 0.2 + Math.sin(angle) * r * 1.5
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.6
  }
  return out
}

// Wide scatter for Skills+
function generateScatterTargets(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = (Math.random() - 0.5) * 10
    out[i * 3 + 1] = (Math.random() - 0.5) * 7
    out[i * 3 + 2] = (Math.random() - 0.5) * 3
  }
  return out
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles({ faceTargets }: { faceTargets: Float32Array | null }) {
  const meshRef = useRef<THREE.Points>(null)
  const { size } = useThree()

  const photoTargets  = useMemo(() => generatePhotoCluster(PARTICLE_COUNT),  [])
  const scatterTargets = useMemo(() => generateScatterTargets(PARTICLE_COUNT), [])
  const textPush = useRef(new Float32Array(PARTICLE_COUNT * 3))

  // Per-particle random values — computed once
  const rng = useMemo(() => {
    const delay     = new Float32Array(PARTICLE_COUNT) // stagger [0..1]
    const floatFreq  = new Float32Array(PARTICLE_COUNT) // float speed
    const floatPhase = new Float32Array(PARTICLE_COUNT) // float phase offset
    const floatAmp   = new Float32Array(PARTICLE_COUNT) // float amplitude
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      delay[i]      = Math.random()
      floatFreq[i]  = 0.3 + Math.random() * 0.5
      floatPhase[i] = Math.random() * Math.PI * 2
      floatAmp[i]   = 0.06 + Math.random() * 0.10
    }
    return { delay, floatFreq, floatPhase, floatAmp }
  }, [])

  const { positions, initialScatter } = useMemo(() => {
    const positions      = new Float32Array(PARTICLE_COUNT * 3)
    const initialScatter = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = (Math.random() - 0.5) * 14
      const z = (Math.random() - 0.5) * 5
      positions[i * 3] = initialScatter[i * 3] = x
      positions[i * 3 + 1] = initialScatter[i * 3 + 1] = y
      positions[i * 3 + 2] = initialScatter[i * 3 + 2] = z
    }
    return { positions, initialScatter }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const pos  = meshRef.current.geometry.attributes.position.array as Float32Array
    const t    = scrollSignal.t          // 0=hero … 1=about … 2=skills+
    const time = state.clock.elapsedTime

    const aspect = size.width / size.height
    const halfH  = Math.tan(FOV_RAD) * CAM_Z
    const halfW  = halfH * aspect
    const mx = globalMouse.x * halfW
    const my = globalMouse.y * halfH

    // Text zone (only relevant in hero)
    const tzCX = typingSignal.ndcX * halfW
    const tzCY = typingSignal.ndcY * halfH
    const tzRX = typingSignal.ndcW * halfW * 1.4
    const tzRY = typingSignal.ndcH * halfH * 3.5
    const { phase, progress: tp } = typingSignal
    const textForce =
      t < 0.05
        ? phase === "typing" ? tp * 0.12 : phase === "idle" && tp > 0.5 ? 0.09 : 0
        : 0

    const mouseRepelRadius   = 0.9
    const mouseRepelStrength = 0.18

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3

      // ── Pick base target ──────────────────────────────────────────────────
      let bx: number, by: number, bz: number

      if (t <= 1.0) {
        // Lerp face → photo based on scroll progress
        const hasFace = faceTargets !== null && ix + 2 < faceTargets.length
        const fx = hasFace ? faceTargets[ix]     : initialScatter[ix]
        const fy = hasFace ? faceTargets[ix + 1] : initialScatter[ix + 1]
        const fz = hasFace ? faceTargets[ix + 2] : initialScatter[ix + 2]
        bx = fx + (photoTargets[ix]     - fx) * t
        by = fy + (photoTargets[ix + 1] - fy) * t
        bz = fz + (photoTargets[ix + 2] - fz) * t
      } else {
        // t > 1: blend photo → scatter
        const s = Math.min(t - 1, 1)
        bx = photoTargets[ix]     + (scatterTargets[ix]     - photoTargets[ix])     * s
        by = photoTargets[ix + 1] + (scatterTargets[ix + 1] - photoTargets[ix + 1]) * s
        bz = photoTargets[ix + 2] + (scatterTargets[ix + 2] - photoTargets[ix + 2]) * s
      }

      // ── Float: gentle sine drift when settled at photo ────────────────────
      // Ramps in as t → 1 and ramps out as t moves away
      const floatStrength = t <= 1
        ? Math.pow(Math.max(0, t - 0.85) / 0.15, 2)   // ramp in last 15%
        : Math.pow(Math.max(0, 1 - (t - 1)), 2)         // ramp out after leaving
      const fAmp = rng.floatAmp[i] * floatStrength
      const tx = bx + Math.sin(time * rng.floatFreq[i]        + rng.floatPhase[i]) * fAmp
      const ty = by + Math.cos(time * rng.floatFreq[i] * 0.7  + rng.floatPhase[i] * 1.4) * fAmp
      const tz = bz

      // ── Staggered lerp — creates the "trail / magic rush" feel ───────────
      // During transition (t 0.05→0.95): particles with low delay rush first
      const inTransition = t > 0.05 && t < 0.95
      let lerpSpeed: number
      if (inTransition) {
        // Particle activates based on its delay relative to scroll progress
        const activateAt = rng.delay[i] * 0.8       // when it "joins" the swarm
        const active     = t > activateAt ? 1 : 0
        lerpSpeed        = active ? 0.10 + rng.delay[i] * 0.06 : 0.01
      } else {
        lerpSpeed = t < 0.05 ? 0.025 : 0.04          // hero: slow assembly; settled: gentle
      }

      // ── Mouse repulsion ───────────────────────────────────────────────────
      const dx   = pos[ix] - mx
      const dy   = pos[ix + 1] - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < mouseRepelRadius && dist > 0.001) {
        const force = ((mouseRepelRadius - dist) / mouseRepelRadius) * mouseRepelStrength
        pos[ix]     += (dx / dist) * force
        pos[ix + 1] += (dy / dist) * force
      }

      // ── Text zone repulsion (hero only) ───────────────────────────────────
      if (textForce > 0) {
        const ex    = (bx - tzCX) / tzRX
        const ey    = (by - tzCY) / tzRY
        const eDist = Math.sqrt(ex * ex + ey * ey)
        if (eDist < 1.0 && eDist > 0.001) {
          const falloff = 1.0 - eDist
          textPush.current[ix]     += ((ex / eDist) * falloff * textForce * 4 - textPush.current[ix])     * 0.08
          textPush.current[ix + 1] += ((ey / eDist) * falloff * textForce * 4 - textPush.current[ix + 1]) * 0.08
        } else {
          textPush.current[ix]     *= 0.92
          textPush.current[ix + 1] *= 0.92
        }
      } else {
        textPush.current[ix]     *= 0.94
        textPush.current[ix + 1] *= 0.94
      }

      // ── Integrate ─────────────────────────────────────────────────────────
      pos[ix]     += (tx + textPush.current[ix]     - pos[ix])     * lerpSpeed
      pos[ix + 1] += (ty + textPush.current[ix + 1] - pos[ix + 1]) * lerpSpeed
      pos[ix + 2] += (tz - pos[ix + 2]) * lerpSpeed
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#892CDC"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function ParticleField() {
  const [faceTargets, setFaceTargets] = useState<Float32Array | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = "/imagem-profissional-sem-fundo-2.png"
    img.onload = () => setFaceTargets(sampleImageParticles(img, PARTICLE_COUNT))
  }, [])

  useEffect(() => {
    function onScroll() {
      const about  = document.getElementById("about")
      const skills = document.getElementById("skills")
      const vh     = window.innerHeight

      if (!about) return

      // Skills+ zone: blend from 1→2 as skills section enters
      if (skills) {
        const sr = skills.getBoundingClientRect().top
        if (sr < vh * 0.5) {
          const s = (vh * 0.5 - sr) / (vh * 0.5)
          scrollSignal.t = 1 + Math.max(0, Math.min(1, s))
          return
        }
      }

      // About zone: transition from 0→1 as soon as about enters the viewport
      const ar = about.getBoundingClientRect().top
      // Start: about top at vh (just entering from bottom)
      // End:   about top at vh * 0.15 (well centred)
      const raw = (vh - ar) / (vh * 0.85)
      scrollSignal.t = Math.max(0, Math.min(1, raw))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles faceTargets={faceTargets} />
      </Canvas>
    </div>
  )
}
