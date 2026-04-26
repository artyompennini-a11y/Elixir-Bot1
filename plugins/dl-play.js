import yts from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} nome canzone`);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return m.reply('⚠️ *𝗥𝗶𝘀𝘂𝗹𝘁𝗮𝘁𝗼 𝗻𝗼𝗻 𝘁𝗿𝗼𝘃𝗮𝘁𝗼.*');

    const url = vid.url;

    // Menu principale Elixir
    if (command === 'play') {
        let infoMsg = `┏━━━━━━━━━━━━━━━━━━━┓\n      🎧 ᴇʟɪxɪʀ ʙᴏᴛ ᴘʟᴀʏᴇʀ 🎧\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
        infoMsg += `◈ 📌 *𝗧𝗶𝘁𝗼𝗹𝗼:* ${vid.title}\n◈ ⏱️ *𝗗𝘂𝗿𝗮𝘁𝗮:* ${vid.timestamp}\n\n`;
        infoMsg += `*𝗦𝗲𝗹𝗲𝘇𝗶𝗼𝗻𝗮 𝗶𝗹 𝗳𝗼𝗿𝗺𝗮𝘁𝗼:*`;

        return await conn.sendMessage(m.chat, {
            image: { url: vid.thumbnail },
            caption: infoMsg,
            footer: 'ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨',
            buttons: [
                { buttonId: `${usedPrefix}playaud ${url}`, buttonText: { displayText: '🎵 𝗔𝗨𝗗𝗜𝗢 (𝗠𝗣𝟯)' }, type: 1 },
                { buttonId: `${usedPrefix}playvid ${url}`, buttonText: { displayText: '🎬 𝗩𝗜𝗗𝗘𝗢 (𝗠𝗣𝟰)' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "🔮", key: m.key } });

    let downloadUrl = null;
    const isAudio = command === 'playaud';

    // Lista API con rotazione automatica per massima stabilità
    const apiList = [
        `https://vreden.my.id{isAudio ? '3' : '4'}?url=${encodeURIComponent(url)}`,
        `https://boxiwan.my.id{isAudio ? '3' : '4'}?url=${encodeURIComponent(url)}`,
        `https://skizo.tech{encodeURIComponent(url)}`,
        `https://eu.org{isAudio ? '3' : '4'}?url=${encodeURIComponent(url)}&apikey=btch-932`
    ];

    for (let api of apiList) {
        try {
            let res = await fetch(api);
            let json = await res.json();
            downloadUrl = json.result?.download?.url || json.data?.url || json.result?.url || json.url || json.result?.link;
            if (downloadUrl && downloadUrl.startsWith('http')) break;
        } catch { continue; }
    }

    if (!downloadUrl) throw new Error('SERVER_OFFLINE');

    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `elixir_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`);

    // Download del file con User-Agent per evitare il blocco 403
    const response = await fetch(downloadUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    
    if (!response.ok) throw new Error('ERR_FILE');
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);

    if (isAudio) {
        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(filePath),
            mimetype: 'audio/mpeg',
            fileName: `${vid.title}.mp3`,
            ptt: false
        }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, {
            video: fs.readFileSync(filePath),
            mimetype: 'video/mp4',
            caption: `✅ *ꜱᴄᴀʀɪᴄᴀᴛᴏ ᴅᴀ ᴇʟɪxɪʀ ʙᴏᴛ*`,
            fileName: `${vid.title}.mp4`
        }, { quoted: m });
    }

    // Pulizia file temporaneo
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply('🚀 *ᴇʟɪxɪʀ ʙᴏᴛ ᴇʀʀᴏʀ:* File non disponibile o server sovraccarico.');
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play|playaud|playvid)$/i;

export default handler;
