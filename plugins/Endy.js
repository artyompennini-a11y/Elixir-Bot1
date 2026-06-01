let handler = async (m, { conn }) => {
  const message = `È gay attento che ti incula`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['endy'];
handler.tags = ['giochi'];

// Questa regex rileva "endy" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /endy/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;