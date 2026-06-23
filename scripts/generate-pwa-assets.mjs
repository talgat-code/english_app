import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const themeColor = '#4f46e5'
const themeDark = '#312e81'
const themeLight = '#c7d2fe'
const slogan = 'Lessons, words, and practice every day'

const rootDir = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(rootDir, 'public')
const iconsDir = path.join(publicDir, 'icons')

function createForeground() {
  return `
    <path d="M214 300C311 259 403 259 490 301V750C404 717 311 717 214 750V300Z" fill="white" />
    <path d="M534 301C621 259 713 259 810 300V750C713 717 620 717 534 750V301Z" fill="white" />
    <rect x="493" y="292" width="38" height="474" rx="19" fill="${themeLight}" />
    <rect x="286" y="402" width="124" height="34" rx="17" fill="${themeColor}" opacity="0.92" />
    <rect x="286" y="467" width="158" height="34" rx="17" fill="#818cf8" />
    <rect x="286" y="532" width="108" height="34" rx="17" fill="${themeColor}" opacity="0.92" />
    <path d="M654 626L741 396L829 626" stroke="${themeDark}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M691 545H791" stroke="${themeDark}" stroke-width="42" stroke-linecap="round" />
  `
}

function createIconSvg(scale = 1) {
  const offset = (1024 - 1024 * scale) / 2

  return `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" rx="224" fill="${themeColor}" />
      <g transform="translate(${offset} ${offset}) scale(${scale})">
        ${createForeground()}
      </g>
    </svg>
  `
}

function createOgSvg() {
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#eef2ff" />
      <rect width="1200" height="630" fill="url(#bg)" />
      <circle cx="1100" cy="90" r="170" fill="rgba(199,210,254,0.32)" />
      <circle cx="120" cy="570" r="180" fill="rgba(255,255,255,0.08)" />
      <rect x="72" y="72" width="1056" height="486" rx="42" fill="rgba(15,23,42,0.16)" />
      <rect x="108" y="108" width="984" height="414" rx="36" fill="rgba(255,255,255,0.1)" />
      <g transform="translate(152 135)">
        <rect width="240" height="240" rx="56" fill="${themeColor}" />
        <g transform="translate(0 0) scale(0.234375)">
          ${createForeground()}
        </g>
      </g>
      <text x="438" y="238" fill="white" font-size="84" font-weight="700" font-family="Arial, Helvetica, sans-serif">English App</text>
      <text x="438" y="320" fill="#e0e7ff" font-size="36" font-weight="500" font-family="Arial, Helvetica, sans-serif">${slogan}</text>
      <text x="438" y="398" fill="rgba(255,255,255,0.86)" font-size="28" font-weight="500" font-family="Arial, Helvetica, sans-serif">Flashcards, quizzes, lessons, and review in one focused app.</text>
      <defs>
        <linearGradient id="bg" x1="68" y1="45" x2="1126" y2="607" gradientUnits="userSpaceOnUse">
          <stop stop-color="${themeColor}" />
          <stop offset="1" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  `
}

async function renderIcon(svg, outputPath, size) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath)
}

async function main() {
  await mkdir(iconsDir, { recursive: true })

  const regularSvg = createIconSvg(1)
  const maskableSvg = createIconSvg(0.8)

  await Promise.all([
    renderIcon(regularSvg, path.join(iconsDir, 'icon-192.png'), 192),
    renderIcon(regularSvg, path.join(iconsDir, 'icon-512.png'), 512),
    renderIcon(maskableSvg, path.join(iconsDir, 'maskable-192.png'), 192),
    renderIcon(maskableSvg, path.join(iconsDir, 'maskable-512.png'), 512),
    renderIcon(regularSvg, path.join(iconsDir, 'apple-touch-icon.png'), 180),
    renderIcon(regularSvg, path.join(iconsDir, 'favicon-32x32.png'), 32),
    renderIcon(regularSvg, path.join(iconsDir, 'favicon-16x16.png'), 16),
    sharp(Buffer.from(createOgSvg())).png().toFile(path.join(publicDir, 'og-image.png')),
  ])

  await writeFile(path.join(publicDir, 'icon.svg'), regularSvg.trimStart())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
