// Plug-in creato da elixir - QR FIXED
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (command === 'qrgruppo') {
    if (!m.isGroup) return m.reply('❌ Comando solo per i gruppi!')
    
    try {
      // Metodo più diretto per ottenere il link d'invito
      let res = await conn.groupInviteCode(m.chat)
      let link = 'https://whatsapp.com' + res
      
      let qr = `https://qrserver.com{link}`
      
      return await conn.sendMessage(m.chat, { 
        image: { url: qr }, 
        caption: `✨ *QR GRUPPO*\n🔗 ${link}` 
      }, { quoted: m })
      
    } catch (e) {
      console.error(e)
      return m.reply('⚠️ Errore! Assicurati che io sia Admin e che i link d\'invito siano attivi.')
    }
  }

  // Comando QR Normale
  if (!text) return m.reply(`💡 Esempio: ${usedPrefix + command} Ciao`)
  
  let qrGen = `https://qrserver.com{encodeURIComponent(text)}`
  
  await conn.sendMessage(m.chat, { 
    image: { url: qrGen }, 
    caption: `✅ *QR GENERATO*\n📝 ${text}` 
  }, { quoted: m })
}

handler.help = ['qr', 'qrgruppo']
handler.tags = ['tools']
handler.command = /^(qr|qrgruppo)$/i

export default handler
