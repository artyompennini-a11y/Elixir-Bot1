// Plug-in creato da elixir
const handler = async (m, { conn, text, participants, groupMetadata }) => {
  let targetMetadata = groupMetadata;
  let isExternal = false;

  // 1. Estrazione pulita del codice invito
  if (text && text.match(/://whatsapp.com\/([0-9A-Za-z]{20,24})/i)) {
    let inviteCode = text.match(/://whatsapp.com\/([0-9A-Za-z]{20,24})/i)[1];
    try {
      // Otteniamo le info del gruppo esterno
      targetMetadata = await conn.groupGetInviteInfo(inviteCode);
      isExternal = true;
    } catch (e) {
      console.error(e);
      return m.reply('❌ *Errore:* Impossibile trovare il gruppo. Il link potrebbe essere scaduto.');
    }
  }

  // 2. Definizione variabili per il messaggio
  const { subject, owner, desc, id, size } = targetMetadata;
  const pp = await conn.profilePictureUrl(isExternal ? id : m.chat, 'image').catch((_) => null) || 'https://ibb.co';
  
  const chat = global.db.data.chats[isExternal ? id : m.chat] || {};
  const admins = isExternal ? [] : participants.filter((p) => p.admin);
  const listAdmin = isExternal ? '│ _Info admin non disponibili via link_' : admins.map((v, i) => `│ 『 *${i + 1}* 』 @${v.id.split('@')[0]}`).join('\n');
  
  // Il creatore per i gruppi esterni è nell'owner, per quelli interni va cercato
  const creator = isExternal ? owner : (owner || admins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net');
  
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
  
  const statoFunzioni = isExternal ? '│ _Configurazione non visibile_' : funzioni
    .map(([nome, val]) => `│ ${status(val)}- ${nome}`)
    .join('\n');
  
  const infoText = `
⋆｡˚『 ╭ \`INFO ✧ GRUPPO\` ╯ 』˚｡⋆
╭
│ 『 📛 』 *Nome:* ${subject}
│ 『 👥 』 *Membri:* ${isExternal ? size : participants.length}
│ 『 👑 』 *Creatore:* ${creator ? `@${creator.split('@')[0]}` : 'Non rilevato'}
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
  
  // 3. Invio con tag funzionanti
  await conn.sendMessage(m.chat, {
    text: infoText,
    mentions: isExternal ? [] : [...admins.map((v) => v.id), creator].filter(Boolean),
    contextInfo: {
      externalAdReply: {
        title: isExternal ? `🔎 GRUPPO ESTERNO: ${subject}` : `🏠 INFO GRUPPO ATTUALE`,
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
