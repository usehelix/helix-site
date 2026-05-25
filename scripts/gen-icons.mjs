// Generate favicon / icon / apple-icon from logo-1024.png using sharp.
// Next.js 14 auto-serves icons placed at app/icon.png + app/apple-icon.png.
// For favicon.ico we use a 32x32 PNG renamed — browsers tolerate this.
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const SRC = 'public/logo-1024.png'

// app/icon.png — Next.js convention, served as /icon
await sharp(SRC).resize(192, 192, { fit: 'cover' }).png().toFile('app/icon.png')
console.log('ok app/icon.png  192x192')

// app/apple-icon.png — iOS home screen
await sharp(SRC).resize(180, 180, { fit: 'cover' }).png().toFile('app/apple-icon.png')
console.log('ok app/apple-icon.png  180x180')

// 32x32 PNG that browsers will accept as favicon.ico
const fav32 = await sharp(SRC).resize(32, 32, { fit: 'cover' }).png().toBuffer()
writeFileSync('public/favicon.ico', fav32)
console.log('ok public/favicon.ico  32x32 PNG renamed')

// Also keep a public/icon.png for the metadata URL reference
await sharp(SRC).resize(192, 192, { fit: 'cover' }).png().toFile('public/icon.png')
console.log('ok public/icon.png  192x192')
await sharp(SRC).resize(180, 180, { fit: 'cover' }).png().toFile('public/apple-icon.png')
console.log('ok public/apple-icon.png  180x180')
