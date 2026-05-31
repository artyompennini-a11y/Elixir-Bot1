let handler = async (m, { conn }) => {
  const message = `Perchè citi il nome di quell'handicappato?.`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['momo'];
handler.tags = ['giochi'];

// Questa regex rileva "momo" ovunque nel messaggio, ignorando maiuscole/minuscole
handler.customPrefix = /punisher/i; 
handler.command = new RegExp; // Sovrascrive il comando standard per usare il prefisso personalizzato

export default handler;