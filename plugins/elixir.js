let handler = async (m, { conn }) => {
  const message = `The punisher è il re di zozzap e se hai qualcosa in contrario ritorna a succhiare le tette di mamma fallito.`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['punisher2'];
handler.tags = ['giochi'];
handler.command = /^(elixir)$/i; // Corretto il regex per attivarsi con "elixir"

export default handler;
