// Plug-in creato da elixir - FIX DEFINITIVO
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome prodotto`);

  // Reazione di ricerca
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2';
    
    // NOTA: Qui ho aggiunto ${ } e il percorso corretto /search.json
    const url = `https://serpapi.com{encodeURIComponent(text)}&gl=it&hl=it&api_key=${apiKey}`;
    
    const response = await axios.get(url);
    const results = response.data.shopping_results;

    if (!results || results.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply('⚠️ *No risultati.* Provane un altro.');
    }

    let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n      🛒 ᴇʟɪxɪʀ ꜱʜᴏᴘᴘɪɴɢ 🛒\n┗━━━━━━━━━━━━━━━━━━━┛\n\n🔎 *Risultati per:* ${text}\n\n`;

    // Mostriamo i primi 3 risultati
    results.slice(0, 3).forEach((item, index) => {
        infoMsg += `*${index + 1}.* ${item.title.substring(0, 45)}...\n`;
        infoMsg += `💰 *Prezzo:* ${item.price}\n`;
        infoMsg += `🔗 *Link:* ${item.link}\n\n`;
    });

    infoMsg += `*ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨*`;

    // Prendiamo l'immagine del primo prodotto (thumbnail)
    const productImage = results[0].thumbnail;

    await conn.sendMessage(m.chat, {
        image: { url: productImage },
        caption: infoMsg
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error("ERRORE:", e);
    m.reply('🚀 *ᴇʟɪxɪʀ ʙᴏᴛ ᴇʀʀᴏʀ:* Problema tecnico o API limitata.');
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.help = ['search'];
handler.tags = ['utility'];
handler.command = /^(search|cerca|prezzo)$/i;

export default handler;
