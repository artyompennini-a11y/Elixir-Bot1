// Plug-in creato da elixir
const axios = require('axios');

// Funzione per cercare il prodotto tramite SerpApi
async function getProductSearch(query) {
    try {
        const apiKey = 'c64c67abffcdced15e89c3ff61f728c481b8d898c5e59461203b5103fcc674d2'; // Registrati su serpapi.com per averne una
        const url = `https://serpapi.com{encodeURIComponent(query)}&gl=it&hl=it&api_key=${apiKey}`;
        
        const response = await axios.get(url);
        const results = response.data.shopping_results;

        if (!results || results.length === 0) return "Nessun prodotto trovato ❌";

        // Prendiamo i primi 3 risultati
        let message = `🛒 *Risultati per:* ${query}\n\n`;
        results.slice(0, 3).forEach((item, index) => {
            message += `${index + 1}. *${item.title}*\n`;
            message += `💰 Prezzo: ${item.price}\n`;
            message += `🔗 Link: ${item.link}\n\n`;
        });

        return message;
    } catch (error) {
        console.error(error);
        return "Errore durante la ricerca del prodotto ⚠️";
    }
}

// Logica all'interno di sock.ev.on('messages.upsert', ...)
sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const from = msg.key.remoteJid;

    if (body.startsWith('.search ')) {
        const query = body.replace('.search ', '').trim();
        const resultText = await getProductSearch(query);
        
        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
    }
});
