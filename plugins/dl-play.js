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

    // Nuova API (Beta-API) più stabile
    const isAudio = command === 'playaud';
    const type = isAudio ? 'mp3' : 'mp4';
    
    // Tentativo con API alternativa
    const res = await fetch(`https://siputzx.my.id{url}`);
    const json = await res.json();
    
    let downloadUrl = isAudio ? json.data?.dl_mp3 : json.data?.dl_mp4;

    // Se la prima fallisce, proviamo una seconda sorgente (Alya-API)
    if (!downloadUrl) {
        const res2 = await fetch(`https://alyachan.dev{url}&apikey=GataDios`);
        const json2 = await res2.json();
        downloadUrl = isAudio ? json2.data?.mp3?.url : json2.data?.mp4?.url;
    }

    if (!downloadUrl) throw new Error('Sorgenti offline');

    // Download effettivo
    const fileRes = await fetch(downloadUrl);
    if (!fileRes.ok) throw new Error('Errore nel recupero del file dal server');
    const buffer = await fileRes.buffer();

    // Invio file
    if (isAudio) {
        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, {
            video: buffer,
            mimetype: 'video/mp4',
            caption: `✅ *Scaricato da Elixir Bot*`,
            fileName: `${vid.title}.mp4`
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('🚀 *Errore:* Le sorgenti sono al momento offline o il file è troppo grande.');
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
