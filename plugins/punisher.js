let handler = async (m, { conn }) => {
  const message = `The punisher è colui che mette in atto le punizioni divine essendo il servo di dio.`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['punisher'];
handler.tags = ['giochi'];

// Questa regex rileva "punisher" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /punisher/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;
