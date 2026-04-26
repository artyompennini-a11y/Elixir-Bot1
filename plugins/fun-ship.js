// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
  let member = participants.map(u => u.id)
  let a = member[Math.floor(Math.random() * member.length)]
  let b = member[Math.floor(Math.random() * member.length)]
  
  while (b === a) b = member[Math.floor(Math.random() * member.length)]
  
  let love = Math.floor(Math.random() * 100)
  
  let caption = `✨ *ELIXIR MATCHMAKER* ✨\n\n`
  caption += `💞 @${a.split('@')[0]} + @${b.split('@')[0]}\n`
  caption += `💓 *Compatibilità:* ${love}%\n\n`
  caption += love > 70 ? "🔥 Una coppia esplosiva!" : "🧊 Forse è meglio restare amici..."

  // Il segreto è passare gli ID nell'array mentions
  await conn.sendMessage(m.chat, { 
    text: caption, 
    mentions: [a, b] 
  }, { quoted: m })
}

handler.help = ['ship']
handler.tags = ['fun']
handler.command = /^(ship|coppia)$/i
handler.group = true

export default handler
