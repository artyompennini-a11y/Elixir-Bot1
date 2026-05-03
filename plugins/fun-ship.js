// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
  let member = participants.map(u => u.id)
  let a = member[Math.floor(Math.random() * member.length)]
  let b = member[Math.floor(Math.random() * member.length)]
  
  // Evitiamo che il bot scelga la stessa persona
  while (b === a) b = member[Math.floor(Math.random() * member.length)]
  
  let love = Math.floor(Math.random() * 100)
  
  let caption = `✨ *THE PUNISHER MATCHMAKER* ✨\n\n`
  caption += `💞 @${a.split('@')[0]} + @${b.split('@')[0]}\n`
  caption += `💓 *Compatibilità:* ${love}%\n\n`
  caption += love > 70 ? "🔥 Una coppia esplosiva!" : "🧊 Forse è meglio restare amici..."

  // FIX: Le menzioni vanno dentro contextInfo per essere cliccabili
  await conn.sendMessage(m.chat, { 
    text: caption, 
    contextInfo: {
      mentionedJid: [a, b],
      externalAdReply: {
        title: `💞 LOVE TEST 💞`,
        body: `Compatibilità: ${love}%`,
        thumbnailUrl: 'https://ibb.co', // Puoi cambiare questa immagine
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })
}

handler.help = ['ship']
handler.tags = ['fun']
handler.command = /^(ship|coppia)$/i
handler.group = true

export default handler
