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
// 0=hero  0→1=about  1=about  1→2=skills  2=skills  2→3=experience  3=experience  3→4=projects  4=projects  4→5=contact
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
    out[i * 3] = (Math.random() - 0.5) * 15
    out[i * 3 + 1] = (Math.random() - 0.5) * 11
    out[i * 3 + 2] = (Math.random() - 0.5) * 4
  }
  return out
}

// Tight cluster at center for contact convergence
function generateConvergeTargets(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2
    const phi    = Math.acos(2 * Math.random() - 1)
    const r      = Math.pow(Math.random(), 0.5) * 0.35
    out[i * 3]     = r * Math.sin(phi) * Math.cos(angle)
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(angle) * 0.6
    out[i * 3 + 2] = r * Math.cos(phi)
  }
  return out
}

// Vertical column along the timeline bar — left side of screen
function generateTimelineTargets(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3]     = -2.2 + (Math.random() - 0.5) * 1.2   // cluster around x=-2.2
    out[i * 3 + 1] = (Math.random() - 0.5) * 5.5           // spread along timeline height
    out[i * 3 + 2] = (Math.random() - 0.5) * 1.5
  }
  return out
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles({ faceTargets, isMobile }: { faceTargets: Float32Array | null; isMobile: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const { size } = useThree()

  const photoTargets    = useMemo(() => generatePhotoCluster(PARTICLE_COUNT),    [])
  const scatterTargets  = useMemo(() => generateScatterTargets(PARTICLE_COUNT),  [])
  const timelineTargets = useMemo(() => generateTimelineTargets(PARTICLE_COUNT), [])
  const convergeTargets = useMemo(() => generateConvergeTargets(PARTICLE_COUNT), [])
  const textPush = useRef(new Float32Array(PARTICLE_COUNT * 3))

  // Per-particle random values — computed once
  const rng = useMemo(() => {
    const delay      = new Float32Array(PARTICLE_COUNT)
    const floatFreq  = new Float32Array(PARTICLE_COUNT)
    const floatPhase = new Float32Array(PARTICLE_COUNT)
    const floatAmp   = new Float32Array(PARTICLE_COUNT)
    // Orbital params
    const orbRadius  = new Float32Array(PARTICLE_COUNT) // [0.4 .. 3.2]
    const orbTheta   = new Float32Array(PARTICLE_COUNT) // initial angle
    const orbSpeed   = new Float32Array(PARTICLE_COUNT) // rad/s ∝ 1/sqrt(r)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      delay[i]      = Math.random()
      floatFreq[i]  = 0.3 + Math.random() * 0.5
      floatPhase[i] = Math.random() * Math.PI * 2
      floatAmp[i]   = 0.06 + Math.random() * 0.10
      const r       = 0.4 + Math.random() * 2.8
      orbRadius[i]  = r
      orbTheta[i]   = Math.random() * Math.PI * 2
      orbSpeed[i]   = 0.28 / Math.sqrt(r)   // Kepler: inner orbits faster
    }
    return { delay, floatFreq, floatPhase, floatAmp, orbRadius, orbTheta, orbSpeed }
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
        // Lerp face → photo
        const hasFace = faceTargets !== null && ix + 2 < faceTargets.length
        const fx = hasFace ? faceTargets[ix]     : initialScatter[ix]
        const fy = hasFace ? faceTargets[ix + 1] : initialScatter[ix + 1]
        const fz = hasFace ? faceTargets[ix + 2] : initialScatter[ix + 2]
        bx = fx + (photoTargets[ix]     - fx) * t
        by = fy + (photoTargets[ix + 1] - fy) * t
        bz = fz + (photoTargets[ix + 2] - fz) * t
      } else if (t <= 2.0) {
        // Lerp photo → scatter (skills)
        const s = t - 1
        bx = photoTargets[ix]     + (scatterTargets[ix]     - photoTargets[ix])     * s
        by = photoTargets[ix + 1] + (scatterTargets[ix + 1] - photoTargets[ix + 1]) * s
        bz = photoTargets[ix + 2] + (scatterTargets[ix + 2] - photoTargets[ix + 2]) * s
      } else if (t <= 3.0) {
        // Lerp scatter → timeline column (experience)
        const s = t - 2
        bx = scatterTargets[ix]     + (timelineTargets[ix]     - scatterTargets[ix])     * s
        by = scatterTargets[ix + 1] + (timelineTargets[ix + 1] - scatterTargets[ix + 1]) * s
        bz = scatterTargets[ix + 2] + (timelineTargets[ix + 2] - scatterTargets[ix + 2]) * s
      } else if (t <= 4.0) {
        // Lerp timeline → live orbital (projects)
        const s     = t - 3
        const angle = rng.orbTheta[i] + time * rng.orbSpeed[i]
        const r     = rng.orbRadius[i]
        const liveX = r * Math.cos(angle)
        const liveY = r * Math.sin(angle) * 0.45
        const liveZ = r * Math.sin(angle) * 0.22
        bx = timelineTargets[ix]     + (liveX - timelineTargets[ix])     * s
        by = timelineTargets[ix + 1] + (liveY - timelineTargets[ix + 1]) * s
        bz = timelineTargets[ix + 2] + (liveZ - timelineTargets[ix + 2]) * s
      } else {
        // Lerp orbital → converge cluster (contact) with pulse
        const s     = Math.min(t - 4, 1)
        const pulse = 1 + 0.55 * Math.sin(time * 2.2 + rng.floatPhase[i] * 0.3)
        bx = convergeTargets[ix]     * pulse
        by = convergeTargets[ix + 1] * pulse
        bz = convergeTargets[ix + 2] * pulse
        // orbital "from" state bleeds in during transition
        if (s < 1) {
          const angle = rng.orbTheta[i] + time * rng.orbSpeed[i]
          const r     = rng.orbRadius[i]
          const fromX = r * Math.cos(angle)
          const fromY = r * Math.sin(angle) * 0.45
          const fromZ = r * Math.sin(angle) * 0.22
          bx = fromX + (bx - fromX) * s
          by = fromY + (by - fromY) * s
          bz = fromZ + (bz - fromZ) * s
        }
      }

      // ── Float (disabled in projects — orbital motion replaces it)
      const photoFloat    = t <= 1
        ? Math.pow(Math.max(0, t - 0.85) / 0.15, 2)
        : Math.pow(Math.max(0, 1 - (t - 1)), 2)
      const scatterFloat  = t > 1 && t <= 2 ? Math.min(1, (t - 1) * 2) * 0.22 : t > 2 && t <= 3 ? Math.max(0, 1 - (t - 2)) * 0.22 : 0
      const timelineFloat = t > 2 && t <= 3 ? Math.min(1, (t - 2) * 2) * 0.40 : t > 3 && t <= 4 ? Math.max(0, 1 - (t - 3)) * 0.40 : 0
      const floatStrength = photoFloat + scatterFloat + timelineFloat
      const fAmp  = rng.floatAmp[i] * floatStrength
      const yBias = t > 2 && t <= 3 ? 1.8 : 0.7
      const tx = bx + Math.sin(time * rng.floatFreq[i]           + rng.floatPhase[i]) * fAmp
      const ty = by + Math.sin(time * rng.floatFreq[i] * yBias   + rng.floatPhase[i] * 1.4) * fAmp * (t > 2 && t <= 3 ? 1.5 : 1)
      const tz = bz

      // ── Staggered lerp
      const inAboutTransition   = t > 0.05 && t < 0.95
      const inExpTransition     = t > 2.05 && t < 2.95
      const inProjTransition    = t > 3.05 && t < 3.95
      const inContactTransition = t > 4.05 && t < 4.95
      let lerpSpeed: number
      if (inAboutTransition) {
        const activateAt = rng.delay[i] * 0.8
        const active     = t > activateAt ? 1 : 0
        lerpSpeed        = active ? 0.10 + rng.delay[i] * 0.06 : 0.01
      } else if (inExpTransition || inProjTransition) {
        lerpSpeed = 0.05 + rng.delay[i] * 0.04
      } else if (inContactTransition) {
        lerpSpeed = 0.06 + rng.delay[i] * 0.05
      } else {
        lerpSpeed = t < 0.05 ? 0.025 : 0.04
      }

      // ── Mouse repulsion (desktop only)
      if (!isMobile) {
        const dx   = pos[ix] - mx
        const dy   = pos[ix + 1] - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouseRepelRadius && dist > 0.001) {
          const force = ((mouseRepelRadius - dist) / mouseRepelRadius) * mouseRepelStrength
          pos[ix]     += (dx / dist) * force
          pos[ix + 1] += (dy / dist) * force
        }
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const img = new Image()
    img.src = "/imagem-profissional-sem-fundo-2.png"
    img.onload = () => setFaceTargets(sampleImageParticles(img, PARTICLE_COUNT))
  }, [])

  useEffect(() => {
    function onScroll() {
      const about      = document.getElementById("about")
      const skills     = document.getElementById("skills")
      const experience = document.getElementById("experience")
      const projects   = document.getElementById("projects")
      const contact    = document.getElementById("contact")
      const vh         = window.innerHeight

      if (!about) return

      // Contact zone: t 4→5
      if (contact) {
        const cr = contact.getBoundingClientRect().top
        if (cr < vh * 0.75) {
          const s = (vh * 0.75 - cr) / (vh * 0.55)
          scrollSignal.t = 4 + Math.max(0, Math.min(1, s))
          return
        }
      }

      // Projects zone: t 3→4
      if (projects) {
        const pr = projects.getBoundingClientRect().top
        if (pr < vh * 0.75) {
          const s = (vh * 0.75 - pr) / (vh * 0.55)
          scrollSignal.t = 3 + Math.max(0, Math.min(1, s))
          return
        }
      }

      // Experience zone: t 2→3
      if (experience) {
        const er = experience.getBoundingClientRect().top
        if (er < vh * 0.75) {
          const s = (vh * 0.75 - er) / (vh * 0.55)
          scrollSignal.t = 2 + Math.max(0, Math.min(1, s))
          return
        }
      }

      // Skills zone: t 1→2
      if (skills) {
        const sr = skills.getBoundingClientRect().top
        if (sr < vh * 0.75) {
          const s = (vh * 0.75 - sr) / (vh * 0.55)
          scrollSignal.t = 1 + Math.max(0, Math.min(1, s))
          return
        }
      }

      // About zone: t 0→1
      const ar = about.getBoundingClientRect().top
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
        <Particles faceTargets={faceTargets} isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
