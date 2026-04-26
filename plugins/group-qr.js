// Plug-in creato da elixir - QR Generator & Group QR
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // LOGICA PER IL QR DEL GRUPPO
  if (command === 'qrgruppo') {
    if (!m.isGroup) return m.reply('❌ Questo comando può essere usato solo nei gruppi!')
    
    try {
      // Ottiene il link d'invito del gruppo
      const code = await conn.groupInviteCode(m.chat)
      const groupLink = `https://whatsapp.com{code}`
      
      // Genera il QR del link d'invito
      const qrUrl = `https://qrserver.com{groupLink}`
      
      await conn.sendMessage(m.chat, { 
        image: { url: qrUrl }, 
        caption: `✨ *QR CODE DEL GRUPPO*\n\n🔗 *Link:* ${groupLink}\n\n_Scansiona per entrare!_` 
      }, { quoted: m })
      
    } catch (e) {
      console.error(e)
      m.reply('⚠️ Impossibile generare il QR. Assicurati che il bot sia *Admin*!')
    }
    return
  }

  // LOGICA PER IL QR GENERICO (TESTO O LINK)
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} [testo o link]\n_Esempio:_ ${usedPrefix + command} www.google.it`)

  await conn.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } })

  try {
    const qrUrl = `https://qrserver.com{encodeURIComponent(text)}`
    
    await conn.sendMessage(m.chat, { 
      image: { url: qrUrl }, 
      caption: `✅ *QR CODE GENERATO*\n\n📝 *Contenuto:* ${text}\n\n*ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨*` 
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('🚀 *ᴇʟɪxɪʀ ʙᴏᴛ ᴇʀʀᴏʀ:* Errore durante la creazione del QR.')
  }
}

handler.help = ['qr', 'qrgruppo']
handler.tags = ['tools']
handler.command = /^(qr|qrgruppo)$/i

export default handler
