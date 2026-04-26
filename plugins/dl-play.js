// Plug-in fixed by elixir
import yts from 'yt-search';
import fg from 'api-dylux';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome canzone`);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return m.reply('⚠️ *Risultato non trovato.*');

    const url = vid.url;

    // Menu principale con bottoni (Ripristinato)
    if (command === 'play') {
        let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n`;
        infoMsg += `      🎧 ᴇʟɪxɪʀ ʙᴏᴛ ᴘʟᴀʏᴇʀ 🎧\n`;
        infoMsg += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
        infoMsg += `◈ 📌 *Titolo:* ${vid.title}\n`;
        infoMsg += `◈ ⏱️ *Durata:* ${vid.timestamp}\n\n`;
        infoMsg += `*Seleziona il formato:*`;

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

    await conn.sendMessage(m.chat, { react: { text: "🔮", key: m.key } });

    let downloadUrl = null;
    const isAudio = command === 'playaud';

    // Prova API Dylux
    try {
        let res = isAudio ? await fg.yta(url) : await fg.ytv(url);
        if (res && res.dl_url) downloadUrl = res.dl_url;
    } catch {
        // Fallback API Vreden (Corretto l'errore di sintassi ${api})
        let type = isAudio ? 'ytmp3' : 'ytmp4';
        let res = await fetch(`https://vreden.my.id{type}?url=${url}`);
        let json = await res.json();
        downloadUrl = json.result?.download?.url || json.result?.url;
    }

    if (!downloadUrl) throw new Error('Download fallito');

    if (isAudio) {
        await conn.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, {
            video: { url: downloadUrl },
            mimetype: 'video/mp4',
            caption: `✅ *Scaricato da Elixir Bot*`,
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('🚀 *Errore:* File non disponibile o server offline.');
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
