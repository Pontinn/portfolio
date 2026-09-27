/*
 * Generates the pre-filtered assets of the transformable project cards, so the
 * runtime CSS does not need `filter` (expensive to repaint every frame):
 *  - public/projects/pontindex/pokebola-white.png: pokebola.webp drawn with
 *    `saturate(0) brightness(3)` (the look the card used to apply at runtime).
 *  - scanline tiles (1x4 and 1x3 px, one white row with the given alpha) printed
 *    as data URIs to paste into TransformCard.css.
 *
 * Not part of the build. Run once: node scripts/generate-card-assets.cjs
 * Needs the global Playwright install (npm i -g playwright).
 */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

function loadPlaywright() {
  try {
    return require("playwright")
  } catch {
    return require(path.join(execSync("npm root -g").toString().trim(), "playwright"))
  }
}

const { chromium } = loadPlaywright()
const ROOT = path.resolve(__dirname, "..")
const POKEBALL_SRC = path.join(ROOT, "public/projects/pontindex/pokebola.webp")
const POKEBALL_OUT = path.join(ROOT, "public/projects/pontindex/pokebola-white.png")

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const webpDataUri = "data:image/webp;base64," + fs.readFileSync(POKEBALL_SRC).toString("base64")

  const pokeballPng = await page.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    ctx.filter = "saturate(0) brightness(3)"
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL("image/png")
  }, webpDataUri)
  fs.writeFileSync(POKEBALL_OUT, Buffer.from(pokeballPng.split(",")[1], "base64"))
  console.log("wrote " + POKEBALL_OUT + " (" + fs.statSync(POKEBALL_OUT).size + " bytes)")

  const tiles = await page.evaluate(() => {
    const make = (period, alpha) => {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = period
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, 1, period)
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")"
      ctx.fillRect(0, 0, 1, 1)
      return canvas.toDataURL("image/png")
    }
    return { zoi: make(4, 0.035), pontindex: make(3, 0.18) }
  })
  console.log("scanline tile zoi (1x4, alpha .035):\n" + tiles.zoi)
  console.log("scanline tile pontindex (1x3, alpha .18):\n" + tiles.pontindex)
  await browser.close()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
