// Plug-in targato Elixir - Universale
let handler = async (m, { conn, usedPrefix, command }) => {
    // Determina il tipo di chat
    let chatType = m.isGroup ? 'GRUPPO' : (m.chat.endsWith('@newsletter') ? 'CANALE/NEWSLETTER' : 'CHAT PRIVATA')
    
    // Recupera l'ID della newsletter dal database o usa quello attuale se il comando è dato in un canale
    let channelId = global.db.data.settings?.[conn.user.jid]?.newsletterId || (m.chat.endsWith('@newsletter') ? m.chat : "Non configurato")
    let botName = global.db.data.nomedelbot || "𝕰𝕷𝕴𝖃𝕴𝕽 𝕭𝕺𝕿"

    let caption = `
〔 ⋇ **ELIXIR ID DETECTOR** ⋇ 〕

📂 **INFO CHAT ATTUALE**
> ⬡ *Tipo:* ${chatType}
> ⬡ *ID:* \`${m.chat}\`

📢 **CONFIGURAZIONE CANALE**
> ⬡ *Bot:* ${botName}
> ⬡ *ID:* \`${channelId}\`

*Tip: Clicca sull'ID per copiarlo automaticamente.*
`.trim()

    await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
            externalAdReply: {
                title: "ID RETRIEVER SYSTEM",
                body: "Elixir Digital Tool",
                thumbnailUrl: 'https://telegra.ph/file/your-image-link.jpg', 
                sourceUrl: '',
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: false
            },
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363233544482017@newsletter',
                newsletterName: `✦ ${botName} ✦`,
                serverMessageId: 100
            }
        }
    }, { quoted: m })
}

handler.help = ['caid']
handler.tags = ['info', 'tools']
handler.command = /^(caid|id|jid)$/i

// Rimosso handler.group = true per renderlo usabile ovunque
handler.group = false 

export default handler