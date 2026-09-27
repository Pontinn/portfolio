/*
 * E2E check of the transformable project cards (Zoi da Goiaba and Pontindex).
 * Not part of the Next build. Needs the dev server running (npm run dev) and the
 * global Playwright install (npm i -g playwright && npx playwright install chromium).
 *
 * Run: node tests/e2e/project-cards-hover.e2e.cjs
 * Env: BASE_URL (default http://localhost:3000), HEADLESS=1 to hide the browser.
 */
const path = require("path")
const { execSync } = require("child_process")

function loadPlaywright() {
  try {
    return require("playwright")
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim()
    return require(path.join(globalRoot, "playwright"))
  }
}

const { chromium } = loadPlaywright()
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const HEADLESS = process.env.HEADLESS === "1"
const SPRITES_PATH = "/projects/pontindex/sprites/"
const VIEWER_NAMES = ["Pitmasters", "Pontindex", "Experio", "KobaFit"]

const failures = []
function check(ok, message) {
  console.log((ok ? "  ok   " : "  FAIL ") + message)
  if (!ok) failures.push(message)
}

async function scrollToProjects(page) {
  await page.evaluate(() => {
    const el = document.getElementById("projects")
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40)
  })
  await page.waitForTimeout(1200)
}

async function centerOn(page, locator) {
  await locator.evaluate((el) => {
    const r = el.getBoundingClientRect()
    window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2)
  })
  await page.waitForTimeout(1200)
}

function trackErrors(page, bucket) {
  page.on("console", (msg) => { if (msg.type() === "error") bucket.push(msg.text()) })
  page.on("pageerror", (err) => bucket.push("pageerror: " + err.message))
}

async function desktop(browser) {
  console.log("\n[desktop 1280x900, hover]")
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  const errors = []
  trackErrors(page, errors)
  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  await scrollToProjects(page)

  const pontindex = page.locator('[data-card="pontindex"]')
  const zoi = page.locator('[data-card="zoi"]')
  check((await pontindex.count()) === 1 && (await zoi.count()) === 1, "both cards rendered")
  check((await pontindex.getAttribute("data-active")) === "false", "pontindex starts inactive")

  // Pontindex: hover activates, sprites peek from the edges, nothing crosses
  await centerOn(page, pontindex)
  let box = await pontindex.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.6)
  await page.waitForTimeout(2500)
  check((await pontindex.getAttribute("data-active")) === "true", "pontindex active on hover")
  const sprites = await pontindex.locator("img.tc-peek").evaluateAll((imgs) =>
    imgs.map((img) => ({ src: img.getAttribute("src"), left: parseFloat(img.style.left), top: parseFloat(img.style.top), size: parseFloat(img.style.width) }))
  )
  check(sprites.length > 0, "sprites on stage: " + sprites.length)
  check(sprites.every((s) => s.src.startsWith(SPRITES_PATH)), "sprites come from " + SPRITES_PATH)
  let crossing = false
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      const a = sprites[i]
      const b = sprites[j]
      if (a.left < b.left + b.size && a.left + a.size > b.left && a.top < b.top + b.size && a.top + a.size > b.top) crossing = true
    }
  }
  check(!crossing, "no pair of sprites crossing")
  check(new Set(sprites.map((s) => s.src)).size === sprites.length, "no duplicated Pokemon on stage")
  check((await pontindex.locator(".tc-tag").count()) === 8, "pontindex stack has 8 tags")
  await page.mouse.move(640, 20)
  await page.waitForTimeout(1500)
  check((await pontindex.getAttribute("data-active")) === "false", "pontindex deactivates on leave")
  check((await pontindex.locator("img.tc-peek").count()) === 0, "sprites cleared on leave")

  // Zoi: hover activates, 5 pointers with the right names
  await centerOn(page, zoi)
  box = await zoi.boundingBox()
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.55)
  await page.waitForTimeout(2500)
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 5 })
  await page.waitForTimeout(500)
  check((await zoi.getAttribute("data-active")) === "true", "zoi active on hover")
  const names = (await zoi.locator(".tc-cursor span").allInnerTexts()).map((s) => s.trim())
  check(names.length === 5, "zoi has 5 pointers: " + names.join(", "))
  check(VIEWER_NAMES.every((n) => names.includes(n)), "viewer pointers named after the other projects")
  check(names.includes("você") || names.includes("you"), "visitor pointer named você/you")
  check((await zoi.locator(".tc-tag").count()) === 8, "zoi stack has 8 tags")
  await page.mouse.move(640, 20)
  await page.waitForTimeout(1500)
  check((await zoi.getAttribute("data-active")) === "false", "zoi deactivates on leave")

  check(errors.length === 0, "no console errors on desktop" + (errors.length ? ": " + JSON.stringify(errors) : ""))
  await context.close()
}

async function mobile(browser) {
  console.log("\n[mobile 390x844, touch]")
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  const errors = []
  trackErrors(page, errors)
  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  check(await page.evaluate(() => matchMedia("(hover: none)").matches), "touch context reports (hover: none)")
  await scrollToProjects(page)
  const zoi = page.locator('[data-card="zoi"]')
  const pontindex = page.locator('[data-card="pontindex"]')

  await centerOn(page, zoi)
  await page.waitForTimeout(1500)
  check((await zoi.getAttribute("data-active")) === "true", "zoi activates when centered in the viewport")
  check((await zoi.locator(".tc-cursor-me").count()) === 0, "no visitor pointer on touch")
  await centerOn(page, pontindex)
  await page.waitForTimeout(1500)
  check((await zoi.getAttribute("data-active")) === "false", "zoi deactivates when it leaves the central band")
  check((await pontindex.getAttribute("data-active")) === "true", "pontindex activates when centered in the viewport")
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1500)
  check((await pontindex.getAttribute("data-active")) === "false", "pontindex deactivates after scrolling away")

  check(errors.length === 0, "no console errors on mobile" + (errors.length ? ": " + JSON.stringify(errors) : ""))
  await context.close()
}

;(async () => {
  const browser = await chromium.launch({ headless: HEADLESS, slowMo: HEADLESS ? 0 : 2000 })
  try {
    await desktop(browser)
    await mobile(browser)
  } finally {
    await browser.close()
  }
  if (failures.length) {
    console.log("\nFAILED (" + failures.length + "):")
    failures.forEach((f) => console.log(" - " + f))
    process.exit(1)
  }
  console.log("\nALL GREEN")
})().catch((err) => {
  console.error(err)
  process.exit(2)
})
