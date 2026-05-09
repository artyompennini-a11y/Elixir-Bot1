// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    // FIX: Gestione sicura degli owner per evitare TypeError
    const ownerList = global.owner || [];
    const ownerJids = ownerList.map(o => {
        let jid = Array.isArray(o) ? o[0] : o;
        return jid.split('@')[0] + '@s.whatsapp.net';
    });

    if (!ownerJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let suffix = ' | SVT BY THE PUNISHER';
        if (!oldName.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${oldName}${suffix}`);
        }
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    // 🔹 RESET LINK GRUPPO
    let newInviteLink = 'https://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF'; 
    try {
        await conn.groupRevokeInvite(m.chat);
        await conn.groupInviteCode(m.chat);
        // Nota: Il link rimane quello statico da te inserito
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    // 🔹 FILTRO PARTECIPANTI (Fix p.id || p.jid)
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.id || p.jid);

    // 🔹 MESSAGGI
    await conn.sendMessage(m.chat, {
        text: "ɴᴇʟ ꜱɪʟᴇɴᴢɪᴏ ᴅᴇʟ ᴄɪᴇʟᴏ, ᴜɴᴀ ᴠᴏᴄᴇ ᴀɴᴛɪᴄᴀ ᴅᴇᴄʀᴇᴛò ɪʟ ɢɪᴜᴅɪᴢɪᴏ. ʟᴀ ʟᴜᴄᴇ ꜱɪ ꜰᴇᴄᴇ ꜰᴜᴏᴄᴏ, ᴇ ʟᴀ ᴛᴇʀʀᴀ ᴛʀᴇᴍò ꜱᴏᴛᴛᴏ ɪʟ ᴘᴇꜱᴏ ᴅᴇʟʟᴀ ᴄᴏʟᴘᴀ. ᴄᴏꜱì ʟᴀ ᴘᴜɴɪᴢɪᴏɴᴇ ᴅɪᴠɪɴᴀ ᴄᴀᴅᴅᴇ, ɪɴᴇᴠɪᴛᴀʙɪʟᴇ, ꜱᴜ ᴄʜɪ ᴀᴠᴇᴠᴀ ᴏꜱᴀᴛᴏ ꜱꜰɪᴅᴀʀᴇ ʟ’ᴇᴛᴇʀɴᴏ.."
    });

    await conn.sendMessage(m.chat, {
        text: `ᴍᴀ ᴛʀᴀ ʟᴇ ʀᴏᴠɪɴᴇ ɴᴀᴄQᴜᴇ ᴜɴ ꜱᴜꜱꜱᴜʀʀᴏ ᴅɪ ꜱᴘᴇʀᴀɴᴢᴀ, ᴜɴ ᴄᴀᴍᴍɪɴᴏ ɴᴀꜱᴄᴏꜱᴛᴏ ᴀɢʟɪ ᴏᴄᴄʜɪ ᴅᴇɪ ꜱᴜᴘᴇʀʙɪ. ᴄʜɪ ꜱᴇᴘᴘᴇ ᴄʜɪɴᴀʀᴇ ɪʟ ᴄᴀᴘᴏ ᴇ ʀɪᴄᴏɴᴏꜱᴄᴇʀᴇ ɪ ᴘʀᴏᴘʀɪ ᴇʀʀᴏʀɪ ᴛʀᴏᴠò ᴜɴᴀ ᴠɪᴀ ᴅɪ ʀᴇᴅᴇɴᴢɪᴏɴᴇ. ᴇ ᴄᴏꜱì, ᴘᴇʀꜱɪɴᴏ ꜱᴏᴛᴛᴏ ɪʟ ɢɪᴜᴅɪᴢɪᴏ ᴅɪᴠɪɴᴏ, ꜰᴜ ᴄᴏɴᴄᴇꜱꜱᴀ ᴜɴᴀ ᴘᴏꜱꜱɪʙɪʟɪᴛᴀ ᴅɪ ꜱᴀʟᴠᴇᴢᴢᴀ.\n\n${newInviteLink}`,
        mentions: allJids
    });

    // 🔹 RIMOZIONE PARTECIPANTI
    try {
        // Rimuove gli utenti a blocchi per evitare ban dal server WhatsApp
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
    }
};

handler.command = ['punisci'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;
