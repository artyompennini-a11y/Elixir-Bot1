// Plug-in creato da elixir - FIX FINALE SINTASSI
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome prodotto`);

  try {
    const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2';
    
    // ATTENZIONE: Nota il simbolo $ prima di {encodeURIComponent(text)}
    // E nota l'uso dell'accento grave ` all'inizio e alla fine dell'URL
    const url = `https://serpapi.com{encodeURIComponent(text)}&gl=it&hl=it&api_key=${apiKey}`;
    
    console.log("🔍 Cerco su internet...");
    
    const response = await axios.get(url);
    const results = response.data.shopping_results;

    if (!results || results.length === 0) return m.reply('⚠️ *Nessun risultato.*');

    let txt = `🛒 *RISULTATI PER:* ${text.toUpperCase()}\n\n`;
    results.slice(0, 3).forEach((item, i) => {
        txt += `*${i + 1}.* ${item.title.substring(0, 50)}...\n💰 *Prezzo:* ${item.price}\n🔗 ${item.link}\n\n`;
    });

    await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

  } catch (e) {
    console.error("❌ ERRORE:");
    console.log(e.message);
    m.reply('🚀 *Errore di connessione.* Assicurati di aver usato il simbolo $ nel codice.');
  }
};

handler.help = ['search'];
handler.tags = ['utility'];
handler.command = /^(search|cerca)$/i;

export default handler;
