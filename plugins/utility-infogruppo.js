// Plug-in creato da elixir
const handler = async (m, { conn, text, participants, groupMetadata }) => {
  let targetMetadata = groupMetadata;
  let isExternal = false;

  // 1. Controllo se l'utente ha inserito un link
  if (text && text.includes('://whatsapp.com')) {
    const code = text.split('://whatsapp.com')[1].trim();
    try {
      targetMetadata = await conn.groupGetInviteInfo(code);
      isExternal = true;
    } catch (e) {
      return m.reply('❌ *Errore:* Link non valido o scaduto.');
    }
  }

  const { subject, owner, desc, creation, id } = targetMetadata;
  const pp = await conn.profilePictureUrl(isExternal ? id : m.chat, 'image').catch((_) => null) || 'https://ibb.co';
  
  // 2. Dati del gruppo (se esterno, non abbiamo la lista completa degli admin/funzioni)
  const chat = global.db.data.chats[isExternal ? id : m.chat] || {};
  const admins = isExternal ? [] : participants.filter((p) => p.admin);
  const listAdmin = isExternal ? '│ _Info non disponibili via link_' : admins.map((v, i) => `│ 『 *${i + 1}* 』 @${v.id.split('@')[0]}`).join('\n');
  const creator = owner || (isExternal ? null : admins.find((p) => p.admin === 'superadmin')?.id);
  
  const status = (val) => val ? '『 ✅ 』' : '『 ❌ 』';
  const funzioni = [
    ['Welcome', chat.welcome],
    ['Antilink', chat.antiLink],
    ['Antidelete', chat.antidelete]
  ];
  
  const statoFunzioni = isExternal ? '│ _Configurazione locale_' : funzioni.map(([nome, val]) => `│ ${status(val)}- ${nome}`).join('\n');
  
  const infoText = `
⋆｡˚『 ╭ \`INFO ✧ GRUPPO\` ╯ 』˚｡⋆
╭
│ 『 📛 』 *Nome:* ${subject}
│ 『 👥 』 *Membri:* ${targetMetadata.size || participants.length}
│ 『 👑 』 *Creatore:* ${creator ? `@${creator.split('@')[0]}` : 'Non disponibile'}
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
        title: isExternal ? '📌 INFO GRUPPO ESTERNO' : '🏠 INFO GRUPPO CORRENTE',
        body: `Gruppo: ${subject}`,
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['infogruppo [link]'];
handler.tags = ['gruppo'];
handler.command = ['infogruppo', 'gp', 'infogp', 'gruppo'];

export default handler;
