// Plug-in creato da elixir (Fixato)
const axios = require('axios');

async function getProductSearch(query) {
    try {
        const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2';
        // URL corretto per l'endpoint di Google Shopping
        const url = `https://serpapi.com{encodeURIComponent(query)}&gl=it&hl=it&api_key=${apiKey}`;
        
        const response = await axios.get(url);
        const results = response.data.shopping_results;

        if (!results || results.length === 0) return "Nessun prodotto trovato ❌";

        let message = `🛒 *Risultati per:* ${query}\n\n`;
        results.slice(0, 3).forEach((item, index) => {
            message += `*${index + 1}. ${item.title}*\n`;
            message += `💰 Prezzo: ${item.price}\n`;
            message += `🔗 Link: ${item.link}\n\n`;
        });

        return message;
    } catch (error) {
        console.error("Errore API SerpApi:", error.response?.data || error.message);
        return "Errore durante la ricerca del prodotto ⚠️";
    }
}

sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Estrazione testo migliorata (gestisce anche maiuscole e spazi extra)
    const body = (msg.message.conversation || 
                  msg.message.extendedTextMessage?.text || 
                  msg.message.imageMessage?.caption || "").trim();
    
    const from = msg.key.remoteJid;
    const isCommand = body.toLowerCase().startsWith('.search ');

    if (isCommand) {
        const query = body.slice(8).trim(); // Prende tutto dopo ".search "
        
        if (!query) {
            return await sock.sendMessage(from, { text: "Scrivi cosa cercare! Esempio: `.search scarpe Nike`" }, { quoted: msg });
        }

        // Feedback immediato all'utente
        await sock.sendMessage(from, { text: "🔍 Sto cercando i prezzi migliori..." });

        const resultText = await getProductSearch(query);
        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
    }
});
