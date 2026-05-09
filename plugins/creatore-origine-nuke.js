// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    // FIX DEFINITIVO: Pulizia JID Owners
    const ownerList = global.owner || [];
    const ownerJids = ownerList.map(o => {
        let raw = Array.isArray(o) ? o[0] : o;
        if (!raw) return '';
        // Rimuove tutto tranne i numeri e aggiunge il suffisso corretto
        let number = raw.toString().replace(/[^0-9]/g, '');
        return number + '@s.whatsapp.net';
    }).filter(jid => jid !== '@s.whatsapp.net');

    if (!ownerJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    // Fix per il Bot ID
    const botId = (conn.user.id.split(':')[0] || conn.user.id.split('@')[0]) + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let suffix = ' | ᴇʟɪxɪʀ';
        if (!oldName.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${oldName}${suffix}`);
        }
    } catch (e) {
        console.error('Errore nome:', e);
    }

    // 🔹 RESET LINK GRUPPO
    let newInviteLink = 'https://whatsapp.com';
    try {
        await conn.groupRevokeInvite(m.chat);
        await conn.groupInviteCode(m.chat);
    } catch (e) {
        console.error('Errore link:', e);
    }

    // 🔹 FILTRO PARTECIPANTI (Esclude bot e owner)
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => 
            jid && 
            jid !== botId && 
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return m.reply("Nessun utente da rimuovere.");

    let allJids = participants.map(p => p.id || p.jid);

    // 🔹 MESSAGGI
    await conn.sendMessage(m.chat, {
        text: "𝐄𝐥𝐢𝐱𝐢𝐫 𝐡𝐚 𝐬𝐭𝐚𝐛𝐢𝐥𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐨𝐫𝐝𝐢𝐧𝐞. 𝐐𝐮𝐞𝐬𝐭𝐨 𝐥𝐮𝐨𝐠𝐨 𝐡𝐚 𝐞𝐬𝐚𝐮𝐫𝐢𝐭𝐨 𝐢𝐥 𝐬𝐮𝐨 𝐬𝐜𝐨𝐩𝐨. 𝐋𝐞 ombre 𝐬𝐢 𝐝𝐢𝐬𝐬𝐨𝐥𝐯𝐨𝐧𝐨 𝐩𝐞𝐫 𝐥𝐚𝐬𝐜𝐢𝐚𝐫𝐞 𝐬𝐩𝐚𝐳𝐢𝐨 𝐚𝐥 𝐬𝐢𝐥ᴇ𝐧𝐳ɪ𝐨."
    });

    await conn.sendMessage(m.chat, {
        text: `𝐋𝐚 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐞 𝐞̀ 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚. 𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐞̀ 𝐝𝐞𝐠𝐧𝐨 𝐩𝐮𝐨̀ 𝐩𝐫𝐨𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐢𝐥 𝐯𝐢𝐚𝐠𝐠𝐢𝐨 𝐯𝐞𝐫𝐬𝐨 𝐥'𝐨𝐫𝐢𝐠𝐢𝐧𝐞.\n\n${newInviteLink}`,
        mentions: allJids
    });

    // 🔹 RIMOZIONE
    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'esecuzione.");
    }
};

handler.command = ['origine'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;
