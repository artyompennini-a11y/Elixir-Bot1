// by elixir
const handler = async (m, { conn }) => {
    try {
        const metadata = await conn.groupMetadata(m.chat);
        const groupName = metadata.subject;
        const inviteCode = await conn.groupInviteCode(m.chat);
        const linkgruppo = 'https://chat.whatsapp.com/' + inviteCode;
        const memberCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(m.chat, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/3Fh9V6p/avatar-group-default.png';
        }

        const messageText = `╭────────────────────╮\n` +
                            `   ✦  𝖶𝖧𝖠𝖳𝖲𝖠𝖯𝖯  𝖦𝖱𝖮𝖴𝖯  𝖫𝖨𝖭𝖪  ✦\n` +
                            `╰────────────────────╯\n\n` +
                            `  ◈  *GRUPPO:* ${groupName.toUpperCase()}\n` +
                            `  ◈  *MEMBRI:* ${memberCount}\n\n` +
                            `──────────────────────\n` +
                            `  *ACCESSO DIRETTO:*\n` +
                            `  ${linkgruppo}\n\n` +
                            `──────────────────────\n` +
                            `  _Richiesto da @${m.sender.split('@')[0]}_`;

        await conn.sendMessage(
            m.chat,
            {
                image: { url: ppUrl },
                caption: messageText,
                mentions: [m.sender]
            },
            { quoted: m }
        );

    } catch (error) {
        console.error(error);
        m.reply('❌ Errore nel recupero del link. Assicurati che il bot sia amministratore.');
    }
};

handler.help = ['link'];
handler.tags = ['gruppo'];
handler.command = /^link$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
