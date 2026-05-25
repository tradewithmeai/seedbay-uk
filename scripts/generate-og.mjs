import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0fdf4"/>
      <stop offset="60%" style="stop-color:#bbf7d0"/>
      <stop offset="100%" style="stop-color:#86efac"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="4" y="4" width="1192" height="622" fill="none" stroke="#22c55e" stroke-width="8" rx="16"/>

  <!-- Sprout stem -->
  <line x1="600" y1="195" x2="600" y2="118" stroke="#15803d" stroke-width="9" stroke-linecap="round"/>
  <!-- Left leaf -->
  <path d="M600 165 C582 153 560 136 566 112 C578 110 596 128 600 165Z" fill="#22c55e"/>
  <!-- Right leaf -->
  <path d="M600 146 C618 134 640 117 634 93 C622 91 604 109 600 146Z" fill="#16a34a"/>
  <!-- Seed -->
  <ellipse cx="600" cy="197" rx="18" ry="11" fill="#a16207" opacity="0.75"/>

  <!-- Title -->
  <text x="600" y="295" text-anchor="middle"
        font-family="Georgia, serif" font-weight="700" font-size="86" fill="#14532d"
        letter-spacing="-1">SeedBay.co.uk</text>

  <!-- Tagline -->
  <text x="600" y="368" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#166534">
    UK Seed Exchange &#8212; Buy, Swap &amp; Give Away Seeds
  </text>

  <!-- Pill badge -->
  <rect x="270" y="415" width="660" height="62" rx="31" fill="white" opacity="0.65"/>
  <text x="600" y="455" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="25" fill="#15803d">
    No fees &#183; No middleman &#183; Contact sellers directly
  </text>
</svg>`

const outputPath = path.join(__dirname, '..', 'public', 'og-image.png')

try {
  await sharp(Buffer.from(svg)).png().toFile(outputPath)
  console.log('✓ OG image generated:', outputPath)
} catch (err) {
  console.error('Failed to generate OG image:', err.message)
  process.exit(1)
}
