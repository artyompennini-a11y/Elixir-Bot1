let handler = async (m, { conn }) => {
  const message = `Per svuotare gruppi ci pensa The punisher, manda il link o a me o al numero del bot`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['nukkare'];
handler.tags = ['giochi'];

// Questa regex rileva "nukkare" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /nukkare/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;