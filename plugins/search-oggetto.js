// Plug-in creato da elixir
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Se l'utente non scrive nulla dopo il comando
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome prodotto\n_Esempio:_ ${usedPrefix + command} mouse gaming`);

  // Reazione di attesa
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2';
    // Endpoint corretto per Google Shopping
    const url = `https://serpapi.com{encodeURIComponent(text)}&gl=it&hl=it&api_key=${apiKey}`;
    
    const response = await axios.get(url);
    const results = response.data.shopping_results;

    if (!results || results.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply('⚠️ *𝗥𝗶𝘀𝘂𝗹𝘁𝗮𝘁𝗼 𝗻𝗼𝗻 𝘁𝗿𝗼𝘃𝗮𝘁𝗼.*');
    }

    // Costruzione del messaggio
    let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n`;
    infoMsg += `      🛒 ᴇʟɪxɪʀ ꜱʜᴏᴘᴘɪɴɢ 🛒\n`;
    infoMsg += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
    infoMsg += `🔎 *Risultati per:* ${text}\n\n`;

    // Prendiamo i primi 3 o 4 risultati per non allungare troppo il messaggio
    results.slice(0, 4).forEach((item, index) => {
        infoMsg += `*${index + 1}. ${item.title.substring(0, 50)}...*\n`;
        infoMsg += `💰 Prezzo: *${item.price}*\n`;
        infoMsg += `🏪 Negozio: ${item.source || 'Online'}\n`;
        infoMsg += `🔗 Link: ${item.link}\n\n`;
    });

    infoMsg += `*ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨*`;

    // Invio con l'immagine del primo prodotto trovato
    await conn.sendMessage(m.chat, {
        image: { url: results[0].thumbnail },
        caption: infoMsg
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('🚀 *ᴇʟɪxɪʀ ʙᴏᴛ ᴇʀʀᴏʀ:* Servizio di ricerca non disponibile.');
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.help = ['search'];
handler.tags = ['utility'];
handler.command = /^(search|cerca|prezzo)$/i;

export default handler;
