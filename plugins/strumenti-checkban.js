import { proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `❌ Esempio d'uso: ${usedPrefix + command} 393479684300`

    let number = text.replace(/[^0-9]/g, '')
    let jid = number + '@s.whatsapp.net'
    
    try {
        const [result] = await conn.onWhatsApp(number)

        let statusMessage = ""
        let isBanned = !result || !result.exists

        if (isBanned) {
            statusMessage = `
╭━〔 📱 𝐒𝐓𝐀𝐓𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📞 𝐍𝐮𝐦𝐞𝐫𝐨: +${number}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🔴 𝐒𝐓𝐀𝐓𝐎: 𝐁𝐀𝐍𝐍𝐀𝐓𝐎
┃ ❌ Il numero non risulta 
┃ registrato o è stato
┃ rimosso dai server.
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝐃𝐄𝐓𝐓𝐀𝐆𝐋𝐈
┣━━━━━━━━━━━━━━━━━━━━━
┃ • 𝐑𝐢𝐬𝐩𝐨𝐬𝐭𝐚: Non Esistente
┃ • 𝐌𝐨𝐭𝐢𝐯𝐨: Violazione Termini
┃ • 𝐒𝐢𝐬𝐭𝐞𝐦𝐚: Verificato
┃ • 𝐃𝐚𝐭𝐚: ${new Date().toLocaleDateString('it-IT')}
┃ • 𝐎𝐫𝐚: ${new Date().toLocaleTimeString('it-IT')}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🆘 𝐒𝐔𝐏𝐏𝐎𝐑𝐓𝐎
┃ https://whatsapp.com
╰━━━━━━━━━━━━━━━━━━━━━╯`
        } else {
            let bio = await conn.fetchStatus(jid).catch(_ => ({ status: 'Nessuna Info' }))
            let pp = await conn.profilePictureUrl(jid, 'image').catch(_ => null)
            
            statusMessage = `
╭━〔 📱 𝐒𝐓𝐀𝐓𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📞 𝐍𝐮𝐦𝐞𝐫𝐨: +${number}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🟢 𝐒𝐓𝐀𝐓𝐎: 𝐀𝐓𝐓𝐈𝐕𝐎
┃ ✅ Registrato correttamente
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝐈𝐍𝐅𝐎 𝐀𝐆𝐆𝐈𝐔𝐍𝐓𝐈𝐕𝐄
┣━━━━━━━━━━━━━━━━━━━━━
┃ • 𝐓𝐢𝐩𝐨: ${result.isBusiness ? 'Account Business' : 'Account Normale'}
┃ • 𝐈𝐧𝐟𝐨: ${bio.status}
┃ • 𝐅𝐨𝐭𝐨: ${pp ? 'Visibile ✅' : 'Privata/Non presente ❌'}
┃ • 𝐋𝐢𝐧𝐤: wa.me/${number}
┃ • 𝐎𝐫𝐚 𝐂𝐡𝐞𝐜𝐤: ${new Date().toLocaleTimeString('it-IT')}
╰━━━━━━━━━━━━━━━━━━━━━╯`
        }

        await conn.sendMessage(m.chat, { text: statusMessage.trim() }, { quoted: m })

    } catch (e) {
        m.reply("⚠️ Errore durante il controllo del numero.")
    }
}

handler.help = ['checkban <numero>']
handler.tags = ['tools']
handler.command = /^(checkban|check)$/i

export default handler