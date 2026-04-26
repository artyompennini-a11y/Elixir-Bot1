import yts from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome canzone`);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return m.reply('⚠️ *Risultato non trovato.*');

    const url = vid.url;

    if (command === 'play') {
        let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n      🎧 ᴇʟɪxɪʀ ʙᴏᴛ ᴘʟᴀʏᴇʀ 🎧\n┗━━━━━━━━━━━━━━━━━━━┛\n\n◈ 📌 *Titolo:* ${vid.title}\n◈ ⏱️ *Durata:* ${vid.timestamp}\n\n*Seleziona il formato:*`;

        return await conn.sendMessage(m.chat, {
            image: { url: vid.thumbnail },
            caption: infoMsg,
            footer: 'ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨',
            buttons: [
                { buttonId: `${usedPrefix}playaud ${url}`, buttonText: { displayText: '🎵 AUDIO (MP3)' }, type: 1 },
                { buttonId: `${usedPrefix}playvid ${url}`, buttonText: { displayText: '🎬 VIDEO (MP4)' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const isAudio = command === 'playaud';
    
    // API Semplice e pulita (Corretta la sintassi dell'URL)
    let apiUrl = `https://vreden.my.id{encodeURIComponent(url)}`;
    if (!isAudio) apiUrl = `https://vreden.my.id{encodeURIComponent(url)}`;

    const res = await fetch(apiUrl);
    const json = await res.json();
    
    const downloadUrl = json.result?.download?.url || json.result?.url;

    if (!downloadUrl) throw new Error('API Error');

    // Invio diretto tramite URL (più leggero per il tuo server)
    if (isAudio) {
        await conn.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            mimetype: 'video/mp4',
            caption: `✅ *Scaricato con successo*`,
            fileName: `${vid.title}.mp4`
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('🚀 *Errore:* Il servizio di download è momentaneamente occupato. Riprova tra pochi secondi.');
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
