// Plug-in creato da elixir - QR & Group QR (FIXED)
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (command === 'qrgruppo') {
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi!')
    
    // Controllo se il bot è admin (necessario per groupInviteCode)
    const groupMetadata = await conn.groupMetadata(m.chat)
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin
    
    if (!isBotAdmin) return m.reply('⚠️ Devo essere *Admin* per generare il QR del gruppo!')

    await conn.sendMessage(m.chat, { react: { text: "🔗", key: m.key } })

    try {
      const code = await conn.groupInviteCode(m.chat)
      const groupLink = `https://whatsapp.com{code}`
      const qrUrl = `https://qrserver.com{groupLink}`
      
      // Scarichiamo l'immagine per sicurezza prima di inviarla
      const response = await axios.get(qrUrl, { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, 'utf-8')

      await conn.sendMessage(m.chat, { 
        image: buffer, 
        caption: `✨ *QR CODE DEL GRUPPO*\n\n🔗 *Link:* ${groupLink}` 
      }, { quoted: m })
      
    } catch (e) {
      console.error("ERRORE QRGRUPPO:", e.message)
      m.reply('🚀 Errore tecnico nel generare il link d\'invito.')
    }
    return
  }

  // LOGICA .qr NORMALE
  if (!text) return m.reply(`🔮 _Scrivi:_ ${usedPrefix + command} testo o link`)

  try {
    const qrUrl = `https://qrserver.com{encodeURIComponent(text)}`
    const response = await axios.get(qrUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'utf-8')

    await conn.sendMessage(m.chat, { 
      image: buffer, 
      caption: `✅ *QR GENERATO*\n\n📝 *Testo:* ${text}` 
    }, { quoted: m })

  } catch (e) {
    console.error("ERRORE QR:", e.message)
    m.reply('🚀 Errore durante la creazione del QR.')
  }
}

handler.help = ['qr', 'qrgruppo']
handler.tags = ['tools']
handler.command = /^(qr|qrgruppo)$/i

export default handler
