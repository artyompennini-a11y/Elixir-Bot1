import { proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Se non viene inserito testo, mostra un errore
    if (!text) throw `❌ Esempio d'uso: ${usedPrefix + command} 393479684300`

    // Estrae solo i numeri
    let number = text.replace(/[^0-9]/g, '')
    
    try {
        // Interroga i server di WhatsApp
        const [result] = await conn.onWhatsApp(number)

        let isBanned = !result || !result.exists
        let statusMessage = ""

        if (isBanned) {
            statusMessage = `
╭━〔 📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐓𝐔𝐒 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📞 𝐍𝐮𝐦𝐞𝐫𝐨:
┃ +${number}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🔴 𝐒𝐓𝐀𝐓𝐎: 𝐁𝐀𝐍𝐍𝐀𝐓𝐎
┃ ❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐛𝐚𝐧𝐧𝐚𝐭𝐨
┃ 𝐝𝐚 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝐃𝐄𝐓𝐓𝐀𝐆𝐋𝐈
┣━━━━━━━━━━━━━━━━━━━━━
┃ • 𝐒𝐭𝐚𝐭𝐮𝐬: Terminato
┃ • 𝐌𝐨𝐭𝐢𝐯𝐨: Violazione Termini
┃ • 𝐀𝐮𝐭𝐡: nessuno
┃ • 𝐀𝐮𝐭𝐨𝐜𝐨𝐧𝐟: n/a
┃ • 𝐎𝐫𝐚: ${new Date().toLocaleString('it-IT')}
╰━━━━━━━━━━━━━━━━━━━━━╯`
        } else {
            statusMessage = `
╭━〔 📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐓𝐔𝐒 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📞 𝐍𝐮𝐦𝐞𝐫𝐨:
┃ +${number}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🟢 𝐒𝐓𝐀𝐓𝐎: ATTIVO
┃ ✅ Numero registrato
┃ correttamente
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝐃𝐄𝐓𝐓𝐀𝐆𝐋𝐈
┣━━━━━━━━━━━━━━━━━━━━━
┃ • JID: ${result.jid}
┃ • Status: Online
┃ • Ora: ${new Date().toLocaleString('it-IT')}
╰━━━━━━━━━━━━━━━━━━━━━╯`
        }

        await conn.sendMessage(m.chat, { text: statusMessage.trim() }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("⚠️ Errore durante il controllo del numero. Riprova più tardi.")
    }
}

handler.help = ['checkban <numero>']
handler.tags = ['tools']
handler.command = /^(checkban)$/i

export default handler