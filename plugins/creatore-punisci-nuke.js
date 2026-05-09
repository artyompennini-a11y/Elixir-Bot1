// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    // --- FILTRO SICUREZZA OWNER & AUTORIZZATI ---
    const ownerList = global.owner || [];
    const modsList = global.mods || [];
    const authorizedJids = [...ownerList, ...modsList].map(o => {
        let raw = Array.isArray(o) ? o[0] : o;
        if (!raw) return '';
        return raw.toString().replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }).filter(jid => jid !== '@s.whatsapp.net');

    if (!authorizedJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    const botId = (conn.user.id.split(':')[0] || conn.user.id.split('@')[0]) + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let suffix = ' | SVT BY THE PUNISHER';
        if (!metadata.subject.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${metadata.subject}${suffix}`);
        }
    } catch (e) { console.error(e) }

    // 🔹 FILTRO RIMOZIONE
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => 
            jid && 
            jid !== botId && 
            !authorizedJids.includes(jid)
        );

    const links = "https://chat.whatsapp.com/KUZvFAnTAnqEmjXuPszt4n\nhttps://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF";

    await conn.sendMessage(m.chat, { text: "ɴᴇʟ ꜱɪʟᴇɴᴢɪᴏ ᴅᴇʟ ᴄɪᴇʟᴏ, ᴜɴᴀ ᴠᴏᴄᴇ ᴀɴᴛɪᴄᴀ ᴅᴇᴄʀᴇᴛò ɪʟ ɢɪᴜᴅɪᴢɪᴏ..." });
    await conn.sendMessage(m.chat, {
        text: `ᴄʜɪ ꜱᴇᴘᴘᴇ ᴄʜɪɴᴀʀᴇ ɪʟ ᴄᴀᴘᴏ ᴛʀᴏᴠò ᴜɴᴀ ᴠɪᴀ ᴅɪ ʀᴇᴅᴇɴᴢɪᴏɴᴇ:\n\n${links}`,
        mentions: participants.map(p => p.id || p.jid)
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) { console.error(e) }
};

handler.command = ['punisci'];
handler.group = true;
handler.owner = true;
export default handler;
