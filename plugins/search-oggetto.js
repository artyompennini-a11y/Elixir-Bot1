// Plug-in creato da elixir - VERSIONE TEST ULTRA-SICURA
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome prodotto`);

  try {
    const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2';
    const url = `https://serpapi.com{encodeURIComponent(text)}&gl=it&hl=it&api_key=${apiKey}`;
    
    console.log("🔍 Tentativo di ricerca per:", text);
    
    const response = await axios.get(url);
    
    // DEBUG: Se questo appare nel terminale, la connessione funziona
    console.log("✅ Risposta ricevuta da SerpApi");

    const results = response.data.shopping_results;

    if (!results || results.length === 0) {
      return m.reply('⚠️ *Nessun risultato trovato.*');
    }

    let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n      🛒 ᴇʟɪxɪʀ ꜱʜᴏᴘᴘɪɴɢ 🛒\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

    results.slice(0, 3).forEach((item, index) => {
        infoMsg += `*${index + 1}.* ${item.title.substring(0, 40)}...\n`;
        infoMsg += `💰 *Prezzo:* ${item.price}\n`;
        infoMsg += `🔗 *Link:* ${item.link}\n\n`;
    });

    // Per ora inviamo SOLO TESTO per vedere se il problema è l'immagine
    await conn.sendMessage(m.chat, { text: infoMsg }, { quoted: m });

  } catch (e) {
    console.error("❌ ERRORE NEL PLUGIN:");
    if (e.response) {
      // L'errore viene dall'API (es. chiave scaduta)
      console.error("Dati Errore API:", e.response.data);
      m.reply(`🚀 *Errore API:* ${e.response.data.error || 'Problema con la chiave'}`);
    } else {
      // L'errore è del codice o della rete
      console.error("Messaggio Errore:", e.message);
      m.reply('🚀 *Errore Interno:* Il server non riesce a raggiungere SerpApi.');
    }
  }
};

handler.help = ['search'];
handler.tags = ['utility'];
handler.command = /^(search|cerca|prezzo)$/i;

export default handler;
