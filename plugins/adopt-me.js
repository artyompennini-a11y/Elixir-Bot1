cat > /mnt/user-data/outputs/animali.js << 'ENDOFFILE'
// ╔═══════════════════════════════════════════╗
// ║      Plug-in creato da elixir             ║
// ║      Sistema completo con evoluzioni      ║
// ╚═══════════════════════════════════════════╝

// ─── DATI ANIMALI ─────────────────────────────────────────────────────────────
const ANIMALI = {
  gatto: {
    nome: 'Gatto', fasi: ['🐱', '🐈', '🐈‍⬛'],
    personalita: 'Indipendente e misterioso',
    cibi: ['🐟 pesce', '🥛 latte', '🍗 pollo'],
    giochi: ['🧶 gomitolo', '🔦 laser', '🪶 piuma']
  },
  cane: {
    nome: 'Cane', fasi: ['🐶', '🐕', '🦮'],
    personalita: 'Fedele e giocoso',
    cibi: ['🦴 osso', '🥩 carne', '🐾 croccantini'],
    giochi: ['🎾 pallina', '🥏 frisbee', '🦮 passeggiata']
  },
  coniglio: {
    nome: 'Coniglio', fasi: ['🐰', '🐇', '🐇'],
    personalita: 'Timido ma affettuoso',
    cibi: ['🥕 carota', '🥬 lattuga', '🌿 erba'],
    giochi: ['📦 scatola', '🪀 pallina', '🌀 tunnel']
  },
  pappagallo: {
    nome: 'Pappagallo', fasi: ['🐣', '🦜', '🦜'],
    personalita: 'Colorato e chiacchierone',
    cibi: ['🌰 noci', '🍓 frutta', '🌽 mais'],
    giochi: ['🎵 musica', '🪞 specchio', '🧩 puzzle']
  },
  pesce: {
    nome: 'Pesce', fasi: ['🐟', '🐠', '🐡'],
    personalita: 'Tranquillo e decorativo',
    cibi: ['🦐 gamberi', '🌿 alghe', '🪸 corallo'],
    giochi: ['🫧 bolle', '🪨 sassi', '🌊 corrente']
  },
  tartaruga: {
    nome: 'Tartaruga', fasi: ['🥚', '🐢', '🐢'],
    personalita: 'Lenta ma saggia',
    cibi: ['🥬 verdure', '🍎 frutta', '🐛 insetti'],
    giochi: ['☀️ bagno di sole', '🪨 rocce', '🌿 erba']
  },
  criceto: {
    nome: 'Criceto', fasi: ['🐭', '🐹', '🐹'],
    personalita: 'Energico e curioso',
    cibi: ['🌾 semi', '🥜 noccioline', '🫐 bacche'],
    giochi: ['🎡 ruota', '🪵 tunnel', '🧸 giocattolo']
  },
  drago: {
    nome: 'Drago', fasi: ['🥚', '🐲', '🐉'],
    personalita: 'Leggendario e potente',
    cibi: ['🔥 fuoco', '💎 gemme', '⚔️ acciaio'],
    giochi: ['🌋 vulcano', '⚡ fulmini', '🏔️ montagne'],
    raro: true
  }
}

const LISTA_NOMI = Object.keys(ANIMALI)
const ANIMALI_RARI = LISTA_NOMI.filter(k => ANIMALI[k].raro)
const ANIMALI_COMUNI = LISTA_NOMI.filter(k => !ANIMALI[k].raro)

// ─── HELPER DATABASE ──────────────────────────────────────────────────────────
function getAnimale(sender) {
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {}
  return global.db.data.users[sender].animale || null
}

function setAnimale(sender, data) {
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {}
  global.db.data.users[sender].animale = data
}

function creaAnimale(tipo, nomePersonale) {
  return {
    tipo,
    nomePersonale: nomePersonale || ANIMALI[tipo].nome,
    livello: 1,
    exp: 0,
    fase: 0, // 0=cucciolo, 1=adulto, 2=anziano
    stats: {
      fame: 100,      // 0-100 (0 = morto di fame)
      felicita: 100,  // 0-100
      salute: 100     // 0-100
    },
    ultimoNutri: 0,
    ultimoGioca: 0,
    ultimoCura: 0,
    adottatoIl: Date.now()
  }
}

// ─── CALCOLI ──────────────────────────────────────────────────────────────────
function aggiornaStat(animale) {
  const ora = Date.now()
  const orePassate = (ora - Math.max(animale.ultimoNutri, animale.adottatoIl)) / 3600000

  // Degrado naturale nel tempo
  animale.stats.fame = Math.max(0, animale.stats.fame - Math.floor(orePassate * 8))
  animale.stats.felicita = Math.max(0, animale.stats.felicita - Math.floor(orePassate * 5))

  // Se fame bassa, cala anche salute
  if (animale.stats.fame < 30) {
    animale.stats.salute = Math.max(0, animale.stats.salute - Math.floor(orePassate * 3))
  }

  return animale
}

function getMood(animale) {
  const media = (animale.stats.fame + animale.stats.felicita + animale.stats.salute) / 3
  if (media >= 80) return { emoji: '😄', testo: 'Felicissimo' }
  if (media >= 60) return { emoji: '🙂', testo: 'Contento' }
  if (media >= 40) return { emoji: '😐', testo: 'Nella norma' }
  if (media >= 20) return { emoji: '😢', testo: 'Triste' }
  return { emoji: '😰', testo: 'In pericolo!' }
}

function getFase(livello) {
  if (livello < 5) return 0   // cucciolo
  if (livello < 15) return 1  // adulto
  return 2                    // anziano
}

function getEmoji(animale) {
  const dati = ANIMALI[animale.tipo]
  return dati.fasi[getFase(animale.livello)]
}

function expPerLivello(livello) {
  return livello * 50
}

function aggiungiExp(animale, quantita) {
  animale.exp += quantita
  while (animale.exp >= expPerLivello(animale.livello)) {
    animale.exp -= expPerLivello(animale.livello)
    animale.livello++
    animale.fase = getFase(animale.livello)
  }
  return animale
}

function barraStatistica(valore, max = 100) {
  const riempita = Math.round((valore / max) * 10)
  const vuota = 10 - riempita
  return '█'.repeat(riempita) + '░'.repeat(vuota) + ` ${valore}/${max}`
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────
let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Questo comando è disponibile solo nei gruppi.', m)
  }

  const sender = m.sender
  let animale = getAnimale(sender)
  const nome = await conn.getName(sender) || 'Soggetto'

  // ══════════════════════════════════════════
  //  !adotta [tipo] [nome]
  // ══════════════════════════════════════════
  if (command === 'adotta') {

    if (animale) {
      const emoji = getEmoji(animale)
      return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
❌ Hai già un animale: ${emoji} *${animale.nomePersonale}*
_Usa \`${usedPrefix}abbandona\` prima di adottarne uno nuovo._`, m)
    }

    let tipoScelto
    let nomePersonale

    if (!args[0]) {
      // Mostra lista animali disponibili
      const lista = ANIMALI_COMUNI.map(k => {
        const a = ANIMALI[k]
        return `│ ${a.fasi[0]} *${k}* - ${a.personalita}`
      }).join('\n')

      return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 🐾 *Animali disponibili:*
 └───────────────────
${lista}
│ ✨ *drago* - Solo con ${usedPrefix}adotta casuale!
│
├─ *Utilizzo:*
│ ${usedPrefix}adotta <tipo> [nome]
│ ${usedPrefix}adotta casuale [nome]
│
*Esempi:*
  ${usedPrefix}adotta gatto Whiskers
  ${usedPrefix}adotta cane Rex
  ${usedPrefix}adotta casuale

_☣️ Ogni animale ha personalità e bisogni unici!_`, m)
    }

    if (args[0].toLowerCase() === 'casuale') {
      // Chance 5% di ottenere un drago
      const rng = Math.random()
      tipoScelto = rng < 0.05
        ? ANIMALI_RARI[Math.floor(Math.random() * ANIMALI_RARI.length)]
        : ANIMALI_COMUNI[Math.floor(Math.random() * ANIMALI_COMUNI.length)]
      nomePersonale = args[1] || ANIMALI[tipoScelto].nome
    } else {
      tipoScelto = args[0].toLowerCase()
      if (!ANIMALI[tipoScelto] || ANIMALI[tipoScelto].raro) {
        return conn.reply(m.chat, `❌ Animale *${args[0]}* non trovato.\n_Usa \`${usedPrefix}adotta\` per vedere la lista._`, m)
      }
      nomePersonale = args.slice(1).join(' ') || ANIMALI[tipoScelto].nome
    }

    if (nomePersonale.length > 20) return conn.reply(m.chat, '❌ Nome troppo lungo. Max 20 caratteri.', m)

    const nuovoAnimale = creaAnimale(tipoScelto, nomePersonale)
    setAnimale(sender, nuovoAnimale)
    await global.db.write()

    const dati = ANIMALI[tipoScelto]
    const emoji = dati.fasi[0]
    const isRaro = dati.raro

    await m.react('🎉')
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
${isRaro ? '✨ *ANIMALE LEGGENDARIO!* ✨\n' : ''}
 ┌───────────────────
 │ ${emoji} *${nomePersonale}* è tuo!
 │ 🏷️ *Tipo:* ${dati.nome}
 │ 💫 *Personalità:* ${dati.personalita}
 └───────────────────

*Comandi disponibili:*
  ${usedPrefix}animale → vedi il tuo animale
  ${usedPrefix}nutri   → dai da mangiare
  ${usedPrefix}gioca   → gioca insieme
  ${usedPrefix}cura    → cura se malato

_☣️ Prenditi cura di lui ogni giorno!_`, m)
  }

  // ══════════════════════════════════════════
  //  !animale
  // ══════════════════════════════════════════
  if (command === 'animale' || command === 'pet' || command === 'miopet') {

    if (!animale) {
      return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
❌ Non hai ancora un animale!
_Usa \`${usedPrefix}adotta\` per adottarne uno._`, m)
    }

    animale = aggiornaStat(animale)
    setAnimale(sender, animale)
    await global.db.write()

    const dati = ANIMALI[animale.tipo]
    const emoji = getEmoji(animale)
    const mood = getMood(animale)
    const faseNome = animale.fase === 0 ? 'Cucciolo' : animale.fase === 1 ? 'Adulto' : 'Anziano'
    const expMax = expPerLivello(animale.livello)
    const giorni = Math.floor((Date.now() - animale.adottatoIl) / 86400000)

    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ ${emoji} *${animale.nomePersonale}*
 │ 🏷️ *Tipo:* ${dati.nome}
 │ 🌱 *Fase:* ${faseNome}
 │ ⭐ *Livello:* ${animale.livello}
 │ 📅 *Con te da:* ${giorni} giorni
 └───────────────────
 ┌───────────────────
 │ ${mood.emoji} *Umore:* ${mood.testo}
 │
 │ 🍖 *Fame:*
 │ ${barraStatistica(animale.stats.fame)}
 │ 😊 *Felicità:*
 │ ${barraStatistica(animale.stats.felicita)}
 │ ❤️ *Salute:*
 │ ${barraStatistica(animale.stats.salute)}
 │ ✨ *EXP:*
 │ ${barraStatistica(animale.exp, expMax)}
 └───────────────────

_☣️ Usa ${usedPrefix}nutri, ${usedPrefix}gioca, ${usedPrefix}cura_`, m)
  }

  // ══════════════════════════════════════════
  //  !nutri
  // ══════════════════════════════════════════
  if (command === 'nutri' || command === 'mangia') {

    if (!animale) return conn.reply(m.chat, `❌ Non hai un animale! Usa \`${usedPrefix}adotta\`.`, m)

    const ora = Date.now()
    const cooldown = 2 * 60 * 60 * 1000 // 2 ore
    const rimasto = cooldown - (ora - animale.ultimoNutri)

    if (rimasto > 0 && animale.ultimoNutri > 0) {
      const min = Math.ceil(rimasto / 60000)
      return conn.reply(m.chat, `⏱️ *${animale.nomePersonale}* ha già mangiato!\n_Riprova tra ${min} minuti._`, m)
    }

    animale = aggiornaStat(animale)
    const dati = ANIMALI[animale.tipo]
    const cibo = dati.cibi[Math.floor(Math.random() * dati.cibi.length)]

    const guadagnoFame = Math.min(100, animale.stats.fame + 35) - animale.stats.fame
    const guadagnoSalute = animale.stats.fame < 30 ? Math.min(100, animale.stats.salute + 10) - animale.stats.salute : 0

    animale.stats.fame = Math.min(100, animale.stats.fame + 35)
    if (guadagnoSalute > 0) animale.stats.salute = Math.min(100, animale.stats.salute + guadagnoSalute)
    animale.ultimoNutri = ora
    animale = aggiungiExp(animale, 10)
    setAnimale(sender, animale)
    await global.db.write()

    await m.react('🍖')
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ ${getEmoji(animale)} *${animale.nomePersonale}* ha mangiato!
 │ 🍽️ *Cibo:* ${cibo}
 └───────────────────
 │ 🍖 Fame: +${guadagnoFame} → ${animale.stats.fame}/100
${guadagnoSalute > 0 ? ` │ ❤️ Salute: +${guadagnoSalute} → ${animale.stats.salute}/100\n` : ''} │ ✨ EXP: +10

_☣️ Puoi nutrirlo di nuovo tra 2 ore._`, m)
  }

  // ══════════════════════════════════════════
  //  !gioca
  // ══════════════════════════════════════════
  if (command === 'gioca' || command === 'play') {

    if (!animale) return conn.reply(m.chat, `❌ Non hai un animale! Usa \`${usedPrefix}adotta\`.`, m)

    const ora = Date.now()
    const cooldown = 1 * 60 * 60 * 1000 // 1 ora
    const rimasto = cooldown - (ora - animale.ultimoGioca)

    if (rimasto > 0 && animale.ultimoGioca > 0) {
      const min = Math.ceil(rimasto / 60000)
      return conn.reply(m.chat, `⏱️ *${animale.nomePersonale}* è stanco di giocare!\n_Riprova tra ${min} minuti._`, m)
    }

    animale = aggiornaStat(animale)
    const dati = ANIMALI[animale.tipo]
    const gioco = dati.giochi[Math.floor(Math.random() * dati.giochi.length)]

    const guadagnoFelicita = Math.min(100, animale.stats.felicita + 30) - animale.stats.felicita

    animale.stats.felicita = Math.min(100, animale.stats.felicita + 30)
    animale.ultimoGioca = ora
    animale = aggiungiExp(animale, 15)

    // Piccola perdita di fame giocando
    animale.stats.fame = Math.max(0, animale.stats.fame - 5)

    setAnimale(sender, animale)
    await global.db.write()

    await m.react('🎮')
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ ${getEmoji(animale)} *${animale.nomePersonale}* ha giocato!
 │ 🎮 *Gioco:* ${gioco}
 └───────────────────
 │ 😊 Felicità: +${guadagnoFelicita} → ${animale.stats.felicita}/100
 │ 🍖 Fame: -5 → ${animale.stats.fame}/100
 │ ✨ EXP: +15

_☣️ Puoi giocare di nuovo tra 1 ora._`, m)
  }

  // ══════════════════════════════════════════
  //  !cura
  // ══════════════════════════════════════════
  if (command === 'cura' || command === 'heal') {

    if (!animale) return conn.reply(m.chat, `❌ Non hai un animale! Usa \`${usedPrefix}adotta\`.`, m)

    animale = aggiornaStat(animale)

    if (animale.stats.salute >= 80) {
      return conn.reply(m.chat, `✅ *${animale.nomePersonale}* è già in ottima salute! (${animale.stats.salute}/100)`, m)
    }

    const ora = Date.now()
    const cooldown = 4 * 60 * 60 * 1000 // 4 ore
    const rimasto = cooldown - (ora - animale.ultimoCura)

    if (rimasto > 0 && animale.ultimoCura > 0) {
      const ore = Math.ceil(rimasto / 3600000)
      return conn.reply(m.chat, `⏱️ Hai già curato *${animale.nomePersonale}* di recente!\n_Riprova tra ${ore} ore._`, m)
    }

    const vecchiaSalute = animale.stats.salute
    animale.stats.salute = Math.min(100, animale.stats.salute + 40)
    animale.ultimoCura = ora
    animale = aggiungiExp(animale, 5)
    setAnimale(sender, animale)
    await global.db.write()

    await m.react('💊')
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ ${getEmoji(animale)} *${animale.nomePersonale}* è stato curato!
 └───────────────────
 │ ❤️ Salute: ${vecchiaSalute} → ${animale.stats.salute}/100
 │ ✨ EXP: +5

_☣️ Puoi curarlo di nuovo tra 4 ore._`, m)
  }

  // ══════════════════════════════════════════
  //  !abbandona
  // ══════════════════════════════════════════
  if (command === 'abbandona' || command === 'rilascia') {

    if (!animale) return conn.reply(m.chat, `❌ Non hai un animale da abbandonare.`, m)

    if (args[0]?.toLowerCase() !== 'conferma') {
      return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
⚠️ Sei sicuro di voler abbandonare *${animale.nomePersonale}*?
_Perderai tutti i progressi!_

Scrivi: \`${usedPrefix}abbandona conferma\``, m)
    }

    const nomeAnimale = animale.nomePersonale
    const emoji = getEmoji(animale)
    setAnimale(sender, null)
    await global.db.write()

    await m.react('😢')
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
😢 Hai abbandonato ${emoji} *${nomeAnimale}*...
_Puoi adottare un nuovo animale con \`${usedPrefix}adotta\`._`, m)
  }

  // ══════════════════════════════════════════
  //  !classifica animali
  // ══════════════════════════════════════════
  if (command === 'classifica-animali' || command === 'topanimali') {

    const utenti = Object.entries(global.db.data.users || {})
      .filter(([, u]) => u.animale)
      .map(([jid, u]) => ({ jid, animale: u.animale }))
      .sort((a, b) => b.animale.livello - a.animale.livello)
      .slice(0, 10)

    if (utenti.length === 0) {
      return conn.reply(m.chat, `❌ Nessun animale adottato nel gruppo ancora!`, m)
    }

    const medaglie = ['🥇', '🥈', '🥉']
    const lista = await Promise.all(utenti.map(async ({ jid, animale: a }, i) => {
      const utentNome = await conn.getName(jid).catch(() => jid.split('@')[0])
      const emoji = getEmoji(a)
      const medal = medaglie[i] || `${i + 1}.`
      return `│ ${medal} ${emoji} *${a.nomePersonale}* (Lv.${a.livello})\n│    👤 ${utentNome}`
    }))

    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ᴀɴɪᴍᴀʟɪ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 🏆 *TOP ANIMALI*
 └───────────────────
${lista.join('\n│\n')}

_☣️ Alleva il tuo animale per scalare la classifica!_`, m)
  }
}

handler.help = ['adopt [tipo] [nome]', 'animale', 'nutri', 'gioca', 'cura', 'abbandona', 'topanimali']
handler.tags = ['animali']
handler.command = ['adopt', 'animale', 'pet', 'miopet', 'nutri', 'mangia', 'gioca', 'play', 'cura', 'heal', 'abbandona', 'rilascia', 'classifica-animali', 'topanimali']

handler.group = true
handler.private = false
handler.owner = false
handler.admin = false
handler.botAdmin = false

export default handler
