// Plug-in nuke creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    // --- FILTRO SICUREZZA OWNER & AUTORIZZATI ---
    const ownerList = global.owner || [];
    const modsList = global.mods || [];
    const premsList = global.prems || [];
    
    const authorizedJids = [...ownerList, ...modsList, ...premsList].map(o => {
        let raw = Array.isArray(o) ? o[0] : o;
        if (!raw) return '';
        return raw.toString().replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }).filter(jid => jid !== '@s.whatsapp.net');

    if (!authorizedJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    const botId = (conn.user.id.split(':')[0] || conn.user.id.split('@')[0]) + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let suffix = ' | ᴇʟɪxɪʀ';
        if (!metadata.subject.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${metadata.subject}${suffix}`);
        }
    } catch (e) { console.error(e) }

    // 🔹 RESET LINK
    try { await conn.groupRevokeInvite(m.chat) } catch (e) {}

    // 🔹 FILTRO RIMOZIONE (Esclude Bot e TUTTI gli autorizzati)
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => 
            jid && 
            jid !== botId && 
            !authorizedJids.includes(jid)
        );

    if (!usersToRemove.length) return m.reply("Nessun utente da rimuovere.");

    const links = "https://chat.whatsapp.com/KUZvFAnTAnqEmjXuPszt4n\nhttps://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF";

    await conn.sendMessage(m.chat, { text: "𝐄𝐥𝐢𝐱𝐢𝐫 𝐡𝐚 𝐬𝐭𝐚𝐛𝐢𝐥𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐨𝐫𝐝𝐢𝐧𝐞. 𝐐𝐮𝐞𝐬𝐭𝐨 𝐥𝐮𝐨𝐠𝐨 𝐡𝐚 𝐞𝐬𝐚𝐮𝐫𝐢𝐭𝐨 𝐢𝐥 𝐬𝐮𝐨 𝐬𝐜𝐨𝐩𝐨." });
    await conn.sendMessage(m.chat, {
        text: `𝐋𝐚 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐞 𝐞̀ 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚. 𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐞̀ 𝐝𝐞𝐠𝐧𝐨 𝐩𝐮𝐨̀ 𝐩𝐫𝐨𝐬𝐞𝐠𝐮𝐢𝐫𝐞:\n\n${links}`,
        mentions: participants.map(p => p.id || p.jid)
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) { console.error(e) }
};

handler.command = ['origine'];
handler.group = true;
handler.owner = true;
export default handler;
