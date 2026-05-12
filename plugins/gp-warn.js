const PROTECTED_USERS = [
  '393784409415@s.whatsapp.net',
  '393514722317@s.whatsapp.net'
];

const handler = async (msg, { conn, command, text, isAdmin, isBotAdmin }) => {
  const chatId = msg.chat;
  
  // --- CONTROLLO ACCESSO ---
  if (!isAdmin) return conn.reply(chatId, '`[!] ACCESSO NEGATO: Privilegi Admin richiesti.`', msg);

  let mentionedJid = msg.mentionedJid?.[0] || msg.quoted?.sender;

  // Identificazione utente dal testo se non c'è tag/quote
  if (!mentionedJid && text) {
    let number = text.split(' ')[0].replace(/[^0-9]/g, '');
    if (number.length >= 8 && number.length <= 15) {
      mentionedJid = number + '@s.whatsapp.net';
    }
  }

  if (!mentionedJid) {
    return conn.reply(chatId, `*───「 ⚠️ UTENTE NON TROVATO 」───*\n\nTagga un utente o rispondi a un suo messaggio.\n\n*Esempio:* \`.warn @user Motivo\`\n*────────────────*`, msg);
  }

  const botNumber = conn.user.jid.split(':')[0] + '@s.whatsapp.net';
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupOwner = groupMetadata.owner || chatId.split('-')[0] + '@s.whatsapp.net';

  // --- PROTEZIONI REALI ---
  // Verifica se il target è un admin del gruppo
  const isTargetAdmin = groupMetadata.participants.find(p => p.id === mentionedJid)?.admin !== null;

  if (mentionedJid === groupOwner || PROTECTED_USERS.includes(mentionedJid) || mentionedJid === botNumber || isTargetAdmin) {
    return conn.reply(chatId, `*───「 👑 TARGET PROTETTO 」───*\n\nL'utente selezionato è un Admin o è nel database delle protezioni.\n*────────────────*`, msg);
  }

  // Inizializzazione Database
  if (!global.db.data.users) global.db.data.users = {}; 
  if (!global.db.data.users[mentionedJid]) global.db.data.users[mentionedJid] = { warn: 0 };
  
  const user = global.db.data.users[mentionedJid];
  const tag = '@' + mentionedJid.split('@')[0];

  // --- COMANDO WARN ---
  if (command === 'warn') {
    // Estrazione motivo: rimuove il numero/tag iniziale dal testo
    let reason = text ? text.replace(new RegExp(`@${mentionedJid.split('@')[0]}|${mentionedJid.split('@')[0]}`, 'gi'), '').trim() : '';
    
    if (!reason || reason.length < 3) {
      return conn.reply(chatId, `*───「 ❌ ERRORE PROTOCOLLO 」───*\n\nDevi inserire una *motivazione* valida.\n\n*Esempio:* \`.warn @user Spam\`\n*────────────────*`, msg);
    }

    user.warn += 1;

    if (user.warn >= 3) {
      if (!isBotAdmin) return conn.reply(chatId, '`[!] Errore: Non posso espellere l\'utente perché non sono Admin.`', msg);
      
      user.warn = 0; // Reset dopo kick
      await conn.groupParticipantsUpdate(chatId, [mentionedJid], 'remove');

      return conn.sendMessage(chatId, {
        text: `┏─━─━─━  〔 🚨 〕  ━─━─━─┓\n     *SECURITY ENFORCEMENT*\n┗─━─━─━─━─━─━─━─━─┛\n\n◈ *Target:* ${tag}\n◈ *Azione:* \`Espulsione Definitiva\`\n◈ *Causa:* \`Accumulo 3/3 Warn\`\n\n> _Protocollo di sicurezza completato._`,
        mentions: [mentionedJid]
      });
    }

    return conn.sendMessage(chatId, {
      text: `┏─━─━─━  〔 ⚠️ 〕  ━─━─━─┓\n     *ELIXIR WARN SYSTEM*\n┗─━─━─━─━─━─━─━─━─┛\n\n◈ *Target:* ${tag}\n◈ *Motivo:* \`${reason}\`\n◈ *Stato:* \`${user.warn}/3 Warn\`\n\n> *Attenzione:* Al prossimo richiamo verrai rimosso dal gruppo.`,
      mentions: [mentionedJid]
    });
  }

  // --- COMANDO UNWARN ---
  if (command === 'unwarn') {
    if (!user.warn || user.warn <= 0) {
        return conn.reply(chatId, '`[!] L\'utente non ha sanzioni attive.`', msg);
    }
    
    user.warn -= 1;

    return conn.sendMessage(chatId, {
      text: `┏─━─━─━  〔 ✅ 〕  ━─━─━─┓\n     *SANZIONE REVOCATA*\n┗─━─━─━─━─━─━─━─━─┛\n\n◈ *Target:* ${tag}\n◈ *Azione:* \`Rimozione 1 Warn\`\n◈ *Nuovo Stato:* \`${user.warn}/3 Warn\`\n\n> _Il sistema ha aggiornato il profilo dell'utente._`,
      mentions: [mentionedJid]
    });
  }
};

handler.help = ['warn', 'unwarn'];
handler.tags = ['admin'];
handler.command = /^(warn|unwarn)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;