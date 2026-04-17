// Shared mutable signal between Hero (writer) and ParticleField (reader).
// Plain object to avoid React re-renders — read every frame in useFrame.
export const typingSignal = {
  phase: "idle" as "idle" | "typing" | "erasing",
  // Normalised progress [0..1]: 1 = word fully typed, 0 = fully erased
  progress: 0,
  // NDC center of the typing element (-1..1 range, Y up like WebGL)
  ndcX: 0,
  ndcY: 0,
  // NDC half-extents of the element
  ndcW: 0.3,
  ndcH: 0.05,
}
