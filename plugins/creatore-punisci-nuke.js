// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerList = global.owner || [];
    const modsList = global.mods || [];
    const authorizedJids = [...ownerList, ...modsList].map(o => {
        let raw = Array.isArray(o) ? o[0] : o;
        return raw.toString().replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }).filter(jid => jid !== '@s.whatsapp.net');

    if (!authorizedJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        await conn.groupUpdateSubject(m.chat, `${metadata.subject} | ꜱᴠᴛ ʙʏ ᴛʜᴇ ᴘᴜɴɪꜱʜᴇʀ`);
    } catch (e) { console.error(e) }

    const link1 = 'https://chat.whatsapp.com/KUZvFAnTAnqEmjXuPszt4n';
    const link2 = 'https://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF';

    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => jid && jid !== botId && !authorizedJids.includes(jid));

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.id || p.jid);

    await conn.sendMessage(m.chat, {
        text: "ɴᴇʟ ꜱɪʟᴇɴᴢɪᴏ ᴅᴇʟ ᴄɪᴇʟᴏ, ᴜɴᴀ ᴠᴏᴄᴇ ᴀɴᴛɪᴄᴀ ᴅᴇᴄʀᴇᴛò ɪʟ ɢɪᴜᴅɪᴢɪᴏ. ᴄᴏꜱì ʟᴀ ᴘᴜɴɪᴢɪᴏɴᴇ ᴅɪᴠɪɴᴀ ᴄᴀᴅᴅᴇ..."
    });

    await conn.sendMessage(m.chat, {
        text: `ᴄʜɪ ꜱᴇᴘᴘᴇ ᴄʜɪɴᴀʀᴇ ɪʟ ᴄᴀᴘᴏ ᴛʀᴏᴠò ᴜɴᴀ ᴠɪᴀ ᴅɪ ʀᴇᴅᴇɴᴢɪᴏɴᴇ.\n\n${link1}\n${link2}`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) { console.error(e) }
};

handler.command = ['punisci'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;
export default handler;
