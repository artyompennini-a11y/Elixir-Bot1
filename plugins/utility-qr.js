// ╔═══════════════════════════════════════════╗
// ║         ELIXIR-BOT • Plugin QR Code       ║
// ║         Sviluppato da: Elixir              ║
// ╚═══════════════════════════════════════════╝

import qrcode from 'qrcode'

let handler = async (m, { conn, args, usedPrefix }) => {

  // ✅ Solo nei gruppi
  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Questo comando è disponibile solo nei gruppi.', m)
  }

  // ✅ Nessun argomento → messaggio di aiuto
  if (!args[0]) {
    return conn.reply(m.chat, `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ǫʀ ᴄᴏᴅᴇ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 📱 *Comando:* ${usedPrefix}qr
 │ ⚙️ *Modulo:* Strumenti
 │ ⚠️ *Status:* Istruzioni
 └───────────────────
*Utilizzo:*
  ${usedPrefix}qr <testo o link>

*Esempi:*
  ${usedPrefix}qr https://google.com
  ${usedPrefix}qr Ciao sono Elixir
  ${usedPrefix}qr +39 123 456 7890

_☣️ Genera un QR code da qualsiasi testo o link._`, m)
  }

  // ✅ Unisce tutti gli argomenti
  const testo = args.join(' ')

  await m.react('🧪')

  try {
    // Genera QR come buffer PNG in memoria
    const qrBuffer = await qrcode.toBuffer(testo, {
      type: 'png',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })

    let fake = global.fake || {}

    // Invia il QR come immagine con caption in stile Elixir
    await conn.sendMessage(m.chat, {
      image: qrBuffer,
      caption: `┏━━━━━━━━━━━━━━━━━━━━┓
 💉 ᴇʟɪxɪʀ - ǫʀ ᴄᴏᴅᴇ 💉
┗━━━━━━━━━━━━━━━━━━━━┛
 ┌───────────────────
 │ 📱 *Contenuto:* ${testo}
 │ ⚙️ *Modulo:* Strumenti
 │ ✅ *Status:* QR Generato
 └───────────────────

_☣️ Scansiona con la fotocamera per aprirlo._`,
      mimetype: 'image/png',
      contextInfo: {
        ...fake.contextInfo,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          ...fake.contextInfo?.forwardedNewsletterMessageInfo,
          newsletterJid: '120363232743845068@newsletter',
          newsletterName: '🩸 Cyber Blood - Tools ☣️'
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error('[QR Plugin] Errore:', e)
    conn.reply(m.chat, '☣️ ERRORE NEL SETTORE STRUMENTI: Impossibile generare il QR code.', m)
  }
}

handler.help = ['qr <testo o link>']
handler.tags = ['strumenti']
handler.command = ['qr']

handler.group = true
handler.private = false
handler.owner = false
handler.admin = false
handler.botAdmin = false

export default handler
