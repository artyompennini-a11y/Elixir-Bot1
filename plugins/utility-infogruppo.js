// Plug-in creato da elixir
let handler = async (m, { conn, groupMetadata }) => {
  const { name, owner, desc, creation, participants } = groupMetadata
  const date = new Date(creation * 1000).toLocaleString('it-IT')
  const creator = owner || groupMetadata.participants.find(p => p.admin === 'superadmin')?.id || m.chat
  
  let text = `📝 *INFO GRUPPO*\n\n`
  text += `📌 *Nome:* ${name}\n`
  text += `👥 *Membri:* ${participants.length}\n`
  text += `👑 *Creatore:* @${creator.split('@')[0]}\n`
  text += `📅 *Creato il:* ${date}\n\n`
  text += `📖 *Descrizione:* \n${desc || 'Nessuna descrizione'}`

  await conn.sendMessage(m.chat, { 
    text: text, 
    mentions: [creator] 
  }, { quoted: m })
}

handler.help = ['infogruppo']
handler.tags = ['group']
handler.command = /^(infogruppo|groupinfo|info)$/i
handler.group = true

export default handler
