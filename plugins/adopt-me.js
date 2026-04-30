// ╔═══════════════════════════════════════════╗
// ║      Plug-in creato da elixir (FIX)       ║
// ╚═══════════════════════════════════════════╝

// ─── DATI ANIMALI ───────────────────────────
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
  drago: {
    nome: 'Drago', fasi: ['🥚', '🐲', '🐉'],
    personalita: 'Leggendario e potente',
    cibi: ['🔥 fuoco', '💎 gemme', '⚔️ acciaio'],
    giochi: ['🌋 vulcano', '⚡ fulmini', '🏔️ montagne'],
    raro: true
  }
}

const LISTA = Object.keys(ANIMALI)
const COMUNI = LISTA.filter(x => !ANIMALI[x].raro)
const RARI = LISTA.filter(x => ANIMALI[x].raro)

// ─── DATABASE ───────────────────────────────
function getPet(user) {
  if (!global.db.data.users[user]) global.db.data.users[user] = {}
  return global.db.data.users[user].pet || null
}

function setPet(user, data) {
  if (!global.db.data.users[user]) global.db.data.users[user] = {}
  global.db.data.users[user].pet = data
}

// ─── CREA ──────────────────────────────────
function crea(tipo, nome) {
  return {
    tipo,
    nome,
    livello: 1,
    exp: 0,
    fame: 100,
    felicita: 100,
    salute: 100,
    ultimo: Date.now()
  }
}

// ─── HANDLER ───────────────────────────────
let handler = async (m, { conn, args, usedPrefix, command }) => {

  const user = m.sender
  let pet = getPet(user)

  // ─── ADOTTA ──────────────────────────────
  if (/^adopt$/.test(command)) {

    if (pet) return m.reply('Hai già un animale.')

    let tipo

    if (!args[0]) {
      return m.reply(`Usa:
${usedPrefix}adopt gatto
${usedPrefix}adopt cane
${usedPrefix}adopt casuale`)
    }

    if (args[0] === 'casuale') {
      tipo = Math.random() < 0.05
        ? RARI[0]
        : COMUNI[Math.floor(Math.random() * COMUNI.length)]
    } else {
      tipo = args[0]
      if (!ANIMALI[tipo] || ANIMALI[tipo].raro) return m.reply('Animale non valido')
    }

    let nome = args[1] || ANIMALI[tipo].nome
    pet = crea(tipo, nome)

    setPet(user, pet)
    await global.db.write()

    return m.reply(`Hai adottato ${nome}! ${ANIMALI[tipo].fasi[0]}`)
  }

  // ─── INFO ────────────────────────────────
  if (/^(animale|pet|miopet)$/.test(command)) {
    if (!pet) return m.reply('Nessun animale.')

    let data = ANIMALI[pet.tipo]

    return m.reply(`
${data.fasi[0]} ${pet.nome}
Lv: ${pet.livello}
Fame: ${pet.fame}
Felicità: ${pet.felicita}
Salute: ${pet.salute}
`)
  }

  // ─── NUTRI ───────────────────────────────
  if (/^(nutri|mangia)$/.test(command)) {
    if (!pet) return m.reply('Nessun animale.')

    pet.fame = Math.min(100, pet.fame + 20)
    pet.exp += 10

    setPet(user, pet)
    await global.db.write()

    return m.reply(`${pet.nome} ha mangiato 🍖`)
  }

  // ─── GIOCA ───────────────────────────────
  if (/^(gioca|play)$/.test(command)) {
    if (!pet) return m.reply('Nessun animale.')

    pet.felicita = Math.min(100, pet.felicita + 20)
    pet.exp += 15

    setPet(user, pet)
    await global.db.write()

    return m.reply(`${pet.nome} ha giocato 🎮`)
  }

  // ─── CURA ────────────────────────────────
  if (/^(cura|heal)$/.test(command)) {
    if (!pet) return m.reply('Nessun animale.')

    pet.salute = Math.min(100, pet.salute + 30)

    setPet(user, pet)
    await global.db.write()

    return m.reply(`${pet.nome} è stato curato 💊`)
  }

  // ─── ABBANDONA ───────────────────────────
  if (/^(abbandona|rilascia)$/.test(command)) {
    if (!pet) return m.reply('Nessun animale.')

    setPet(user, null)
    await global.db.write()

    return m.reply('Animale abbandonato 😢')
  }

  // ─── CLASSIFICA ──────────────────────────
  if (/^(classificaanimali|topanimali)$/.test(command)) {

    let users = Object.entries(global.db.data.users)
      .filter(([_, v]) => v.pet)
      .sort((a, b) => b[1].pet.livello - a[1].pet.livello)
      .slice(0, 5)

    if (!users.length) return m.reply('Nessuna classifica.')

    let text = '🏆 TOP PET\n\n'

    for (let i = 0; i < users.length; i++) {
      let p = users[i][1].pet
      text += `${i + 1}. ${p.nome} (Lv.${p.livello})\n`
    }

    return m.reply(text)
  }
}

// ✅ REGEX FIX
handler.command = /^(adopt|animale|pet|miopet|nutri|mangia|gioca|play|cura|heal|abbandona|rilascia|classificaanimali|topanimali)$/i

handler.group = true

export default handler
