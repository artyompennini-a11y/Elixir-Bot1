let handler = async (m, { conn }) => {
  const message = `The punisher è il re di zozzap e se hai qualcosa in contrario ritorna a succhiare le tette di mamma fallito.`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['punisher'];
handler.tags = ['giochi'];

// Questa regex rileva "punisher" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /punisher/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;
