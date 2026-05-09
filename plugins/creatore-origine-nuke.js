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
        let suffix = ' | ꜱᴠᴛ ʙʏ ᴇʟɪxɪʀ';
        if (!metadata.subject.includes(suffix)) {
            await conn.groupUpdateSubject(m.chat, `${metadata.subject}${suffix}`);
        }
    } catch (e) {}

    // 🔹 LINK DA INVIARE
    const links = "https://chat.whatsapp.com/KUZvFAnTAnqEmjXuPszt4n\nhttps://chat.whatsapp.com/Cdsvt0M8WKd1eobU1vNvsF";

    // 🔹 FILTRO RIMOZIONE (Esclude Bot e TUTTI gli autorizzati)
    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => jid && jid !== botId && !authorizedJids.includes(jid));

    if (!usersToRemove.length) return m.reply("Nessun utente da rimuovere (esclusi protetti).");

    await conn.sendMessage(m.chat, { text: "𝐄𝐥𝐢𝐱𝐢𝐫 𝐡𝐚 𝐬𝐭𝐚𝐛𝐢𝐥𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐨𝐫𝐝𝐢𝐧𝐞. 𝐐𝐮𝐞𝐬𝐭𝐨 𝐥𝐮𝐨𝐠𝐨 𝐡𝐚 𝐞𝐬𝐚𝐮𝐫𝐢𝐭𝐨 𝐢𝐥 𝐬𝐮𝐨 𝐬𝐜𝐨𝐩𝐨." });
    
    await conn.sendMessage(m.chat, {
        text: `𝐋𝐚 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐞 𝐞̀ 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚. 𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐞̀ 𝐝𝐞𝐠𝐧𝐨 𝐩𝐮𝐨̀ 𝐩𝐫𝐨𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐢𝐥 𝐯𝐢𝐚𝐠𝐠𝐢𝐨 𝐯𝐞𝐫𝐬𝐨 𝐥'𝐨𝐫𝐢𝐠𝐢𝐧𝐞.\n\n${links}`,
        mentions: participants.map(p => p.id || p.jid)
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {}
};

handler.command = ['origine'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;
export default handler;
