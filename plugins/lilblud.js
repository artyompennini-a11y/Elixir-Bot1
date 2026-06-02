let handler = async (m, { conn }) => {
  const message = `Lascia stare la leggenda del gruppo (è gay)`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['lil blud'];
handler.tags = ['giochi'];

// Questa regex rileva "lil blud" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /lil blud/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;