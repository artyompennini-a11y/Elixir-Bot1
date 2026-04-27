// Plug-in targato Elixir
let handler = async (m, { conn, groupMetadata, usedPrefix }) => {
    // Recupero ID Gruppo
    const groupId = m.chat
    
    // Recupero ID Canale/Newsletter dalle impostazioni globali
    const channelId = global.db.data.settings?.[conn.user.jid]?.newsletterId || "Non configurato"
    const channelName = global.db.data.nomedelbot || "𝕰𝕷𝕴𝖃𝕴𝕽 𝕭𝕺𝕿"

    let caption = `
〔 ⋇ **IDENTIFICATIVI DI SISTEMA** ⋇ 〕

✨ **GRUPPO ATTUALE**
> ⬡ *Nome:* ${groupMetadata.subject}
> ⬡ *ID:* \`${groupId}\`

📢 **CANALE UFFICIALE**
> ⬡ *Owner:* ${channelName}
> ⬡ *ID:* \`${channelId}\`

*Tip: Per copiare l'ID, tieni premuto sul codice sopra.*
`.trim()

    await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
            externalAdReply: {
                title: "ELIXIR ID FINDER",
                body: "Data Recovery System",
                thumbnailUrl: 'https://telegra.ph/file/your-image-link.jpg', // Inserisci il logo del bot
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
            },
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelId !== "Non configurato" ? channelId : '120363233544482017@newsletter',
                newsletterName: channelName,
                serverMessageId: 1
            }
        }
    }, { quoted: m })
}

handler.help = ['caid', 'gpid']
handler.tags = ['group', 'info']
handler.command = /^(caid|gpid|gcid|channelid)$/i
handler.group = true

export default handler