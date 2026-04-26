// Plug-in creato da elixir
// Plug-in creato da elixir - INFO GRUPPO PRO
const handler = async (m, { conn, participants, groupMetadata }) => {
  // 1. Recupero Immagine del gruppo o fallback
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || 'https://i.ibb.co/N25rgPrX/Gaara.jpg';
  
  // 2. Recupero impostazioni dal database (con valori di default se non esistono)
  const chat = global.db.data.chats[m.chat] || {}
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `│ 『 *${i + 1}* 』 @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  
  // 3. Funzione per le icone di stato
  const status = (val) => val ? '『 ✅ 』' : '『 ❌ 』'
  
  // 4. Mappatura delle funzioni attive
  const funzioni = [
    ['Welcome', chat.welcome],
    ['Rilevamento', chat.detect],
    ['Antilink', chat.antiLink],
    ['Reazioni', chat.reaction],
    ['Antidelete', chat.antidelete],
    ['Antitoxic', chat.antiToxic]
  ]
  
  const statoFunzioni = funzioni
    .map(([nome, val]) => `│ ${status(val)}- ${nome}`)
    .join('\n')
  
  // 5. Costruzione del Testo
  const text = `
⋆｡˚『 ╭ \`INFO ✧ GRUPPO\` ╯ 』˚｡⋆
╭
│ 『 📛 』 *Nome:* ${groupMetadata.subject}
│ 『 👥 』 *Membri:* ${participants.length}
│ 『 👑 』 *Creatore:* @${owner.split('@')[0]}
│
│ 『 ✨ 』 *Amministratori:*
${listAdmin}
│
│ 『 ⚙️ 』 *Configurazione:*
${statoFunzioni}
│
│ 『 📢 』 *Descrizione:* 
│ ${groupMetadata.desc?.toString() || 'Nessuna descrizione'}
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─`.trim();
  
  // 6. Invio del messaggio con anteprima professionale
  await conn.sendMessage(m.chat, {
    text: text,
    mentions: [...groupAdmins.map((v) => v.id), owner],
    contextInfo: {
      externalAdReply: {
        title: `ᴇʟɪxɪʀ ʙᴏᴛ • 𝟤𝟢𝟤𝟨`,
        body: `Gruppo: ${groupMetadata.subject}`,
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
};

handler.help = ['infogruppo'];
handler.tags = ['gruppo'];
handler.command = ['infogruppo', 'gp', 'infogp', 'gruppo'];
handler.group = true;

export default handler;
