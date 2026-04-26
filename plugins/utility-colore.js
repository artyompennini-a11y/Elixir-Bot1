// ╔═══════════════════════════════════════════╗
// ║      ELIXIR-BOT • Plugin Colore HEX       ║
// ║      Nessuna API esterna necessaria       ║
// ╚═══════════════════════════════════════════╝

// Converte HEX → RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return { r, g, b }
}

// Converte RGB → HSL
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// Converte RGB → CMYK
function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  }
}

// Luminosità percepita (per determinare se il testo sopra è chiaro o scuro)
function luminanza(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

// Nome colore approssimato (palette base)
function getNomeColore(h, s, l) {
  if (s < 10) {
    if (l < 15) return 'Nero'
    if (l < 40) return 'Grigio scuro'
    if (l < 65) return 'Grigio'
    if (l < 85) return 'Grigio chiaro'
    return 'Bianco'
  }
  if (l < 20) return 'Molto scuro'
  if (l > 80) return 'Molto chiaro / Pastello'

  if (h < 15 || h >= 345) return 'Rosso'
  if (h < 30) return 'Rosso-Arancione'
  if (h < 45) return 'Arancione'
  if (h < 65) return 'Giallo-Arancione'
  if (h < 80) return 'Giallo'
  if (h < 105) return 'Giallo-Verde'
  if (h < 150) return 'Verde'
  if (h < 175) return 'Verde-Ciano'
  if (h < 195) return 'Ciano'
  if (h < 225) return 'Azzurro'
  if (h < 255) return 'Blu'
  if (h < 285) return 'Blu-Viola'
  if (h < 315) return 'Viola'
  if (h < 345) return 'Rosa-Viola'
  return 'Rosso'
}

// Genera colore complementare
function complementare(h) {
  return (h + 180) % 360
}

// HSL → HEX per il complementare
function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

let handler = async (m, { conn, args, usedPrefix }) => {

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Questo comando è disponibile solo nei gruppi.', m)
  }

  if (!args[0]) {
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴄᴏʟᴏʀᴇ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 🎨 *Comando:* ${usedPrefix}colore
 │ ⚙️ *Modulo:* Strumenti
 │ ⚠️ *Status:* Istruzioni
 └───────────────────
*Utilizzo:*
  ${usedPrefix}colore <#HEX>

*Esempi:*
  ${usedPrefix}colore #ff0000
  ${usedPrefix}colore #1a1a2e
  ${usedPrefix}colore ff6b6b

_☣️ Analisi completa di qualsiasi colore HEX._`, m)
  }

  // Normalizza il colore (rimuove # e spazi)
  let hex = args[0].replace('#', '').trim().toLowerCase()

  // Supporta shorthand (es. fff → ffffff)
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')

  if (!/^[0-9a-f]{6}$/.test(hex)) {
    return conn.reply(m.chat, `❌ *Codice HEX non valido:* \`${args[0]}\`\n_Usa un formato come \`#ff0000\` o \`ff0000\`._`, m)
  }

  await m.react('🎨')

  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const { c, m: cm, y, k } = rgbToCmyk(r, g, b)
  const nome = getNomeColore(h, s, l)
  const lum = luminanza(r, g, b)
  const aspetto = lum > 0.5 ? '☀️ Chiaro' : '🌑 Scuro'
  const hexComp = hslToHex(complementare(h), s, l)

  await conn.sendMessage(m.chat, {
    text: `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴄᴏʟᴏʀᴇ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 🎨 *Colore:* #${hex.toUpperCase()}
 │ 🏷️ *Nome:* ${nome}
 │ 💡 *Luminosità:* ${aspetto}
 └───────────────────
 ┌───────────────────
 │ 🔴 *HEX:*  #${hex.toUpperCase()}
 │ 🟢 *RGB:*  rgb(${r}, ${g}, ${b})
 │ 🔵 *HSL:*  hsl(${h}°, ${s}%, ${l}%)
 │ 🟡 *CMYK:* ${c}%, ${cm}%, ${y}%, ${k}%
 └───────────────────
 ┌───────────────────
 │ 🔄 *Complementare:* ${hexComp}
 │ 🌗 *Canali:* R:${r} G:${g} B:${b}
 └───────────────────

_☣️ Analisi colore completata._`
  }, { quoted: m })
}

handler.help = ['colore <#hex>']
handler.tags = ['strumenti']
handler.command = ['colore', 'color', 'hex']

handler.group = true
handler.private = false
handler.owner = false
handler.admin = false
handler.botAdmin = false

export default handler
