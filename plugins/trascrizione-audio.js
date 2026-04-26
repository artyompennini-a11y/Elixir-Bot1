// Plug-in creato da elixir
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Controlla se il messaggio è un audio o se si sta rispondendo a un audio
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/audio/.test(mime)) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Rispondi a un messaggio vocale con:_ ${usedPrefix + command}`)

    await conn.sendMessage(m.chat, { react: { text: "✍️", key: m.key } })

    try {
        // Usiamo il metodo di download interno del tuo bot senza importare Baileys
        let media = await q.download()
        
        // Se il download fallisce
        if (!media) throw new Error('Impossibile scaricare il media')

        m.reply("_Sto analizzando l'audio..._")
        
        // Simulazione trascrizione (qui andrebbe l'API di OpenAI o Whisper)
        setTimeout(() => {
            m.reply(`📝 *𝗧𝗿𝗮𝘀𝗰𝗿𝗶𝘇𝗶𝗼𝗻𝗲 𝗩𝗼𝗰𝗮𝗹𝗲:* \n\n"Ehi, ho ricevuto il tuo vocale! Per ora questa è una trascrizione di test. Per quella reale serve collegare un'API tipo OpenAI."`)
        }, 3000)

    } catch (e) {
        console.error(e)
        m.reply('🚀 *ᴇʟɪxɪʀ ʙᴏᴛ ᴇʀʀᴏʀ:* Problema nel download dell\'audio.')
    }
}

handler.help = ['read', 'trascrivi']
handler.tags = ['tools']
handler.command = /^(read|trascrivi|leggy)$/i

export default handler
