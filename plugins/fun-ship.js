// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
  let member = participants.map(u => u.id)
  let a = member[Math.floor(Math.random() * member.length)]
  let b = member[Math.floor(Math.random() * member.length)]
  
  // Evitiamo che scelga la stessa persona
  while (b === a) b = member[Math.floor(Math.random() * member.length)]
  
  let love = Math.floor(Math.random() * 100)
  let nameA = `@${a.split('@')[0]}`
  let nameB = `@${b.split('@')[0]}`
  
  let caption = `✨ *ELIXIR MATCHMAKER* ✨\n\n`
  caption += `💞 ${nameA} + ${nameB}\n`
  caption += `💓 *Compatibilità:* ${love}%\n\n`
  caption += love > 70 ? "🔥 Una coppia esplosiva!" : "🧊 Forse è meglio restare amici..."

  await conn.sendMessage(m.chat, { text: caption, mentions: [a, b] }, { quoted: m })
}

handler.help = ['ship']
handler.tags = ['fun']
handler.command = /^(ship|coppia)$/i
handler.group = true

export default handler
