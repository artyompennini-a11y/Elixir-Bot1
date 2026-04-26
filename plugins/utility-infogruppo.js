// Plug-in creato da elixir - INFO GRUPPO PRO (SYNTAX FIXED)
const handler = async (m, { conn, text, participants, groupMetadata }) => {
  let targetMetadata = groupMetadata;
  let isExternal = false;

  // 1. Estrazione sicura del codice link
  const linkRegex = /://whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  if (text && text.match(linkRegex)) {
    const [ , code] = text.match(linkRegex);
    try {
      targetMetadata = await conn.groupGetInviteInfo(code);
      isExternal = true;
    } catch (e) {
      return m.reply('❌ *Errore:* Link non valido o scaduto.');
    }
  }

  const { subject, owner, desc, id, size } = targetMetadata;
  const pp = await conn.profilePictureUrl(isExternal ? id : m.chat, 'image').catch((_) => null) || 'https://ibb.co';
  
  const chat = global.db.data.chats[isExternal ? id : m.chat] || {};
  const admins = isExternal ? [] : participants.filter((p) => p.admin);
  const listAdmin = isExternal ? '│ _Non disponibili_' : admins.map((v, i) => `│ 『 *${i + 1}* 』 @${v.id.split('@')[0]}`).join('\n');
  
  const creator = isExternal ? owner : (owner || admins.find((p) => p.admin === 'superadmin')?.id || m.chat.split('-')[0] + '@s.whatsapp.net');
  
  const status = (val) => val ? '『 ✅ 』' : '『 ❌ 』';
  
  const funzioni = [
    ['Welcome', chat.welcome],
    ['Rilevamento', chat.detect],
    ['Antilink', chat.antiLink],
    ['Antilink 2', chat.antiLink2],
    ['Reazioni', chat.reaction],
    ['Antidelete', chat.antidelete],
    ['Antitoxic', chat.antiToxic]
  ];
  
  const statoFunzioni = isExternal ? '│ _Configurazione locale_' : funzioni
    .map(([nome, val]) => `│ ${status(val)}- ${nome}`)
    .join('\n');
  
  const infoText = `
⋆｡˚『 ╭ \`INFO ✧ GRUPPO\` ╯ 』˚｡⋆
╭
│ 『 📛 』 *Nome:* ${subject}
│ 『 👥 』 *Membri:* ${isExternal ? size : participants.length}
│ 『 👑 』 *Creatore:* @${creator ? creator.split('@')[0] : 'Sconosciuto'}
│
│ 『 ✨ 』 *Amministratori:*
${listAdmin}
│
│ 『 ⚙️ 』 *Configurazione:*
${statoFunzioni}
│
│ 『 📢 』 *Descrizione:* 
│ ${desc?.toString() || 'Nessuna descrizione'}
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─`.trim();
  
  await conn.sendMessage(m.chat, {
    text: infoText,
    mentions: isExternal ? [] : [...admins.map((v) => v.id), creator].filter(Boolean),
    contextInfo: {
      externalAdReply: {
        title: isExternal ? `🔎 GRUPPO: ${subject}` : `🏠 INFO GRUPPO ATTUALE`,
        body: `ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨`,
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['infogruppo', 'infogruppo [link]'];
handler.tags = ['gruppo'];
handler.command = ['infogruppo', 'gp', 'infogp', 'gruppo'];
handler.group = true;

export default handler;
