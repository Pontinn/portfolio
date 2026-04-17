import Navbar from "@/components/ui/Navbar"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Skills from "@/components/sections/Skills"
import Experience from "@/components/sections/Experience"
import Projects from "@/components/sections/Projects"
import Contact from "@/components/sections/Contact"
import ParticleField from "@/components/ui/ParticleFieldWrapper"

export default function Home() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
