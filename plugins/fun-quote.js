// Plug-in creato da elixir
let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifichiamo che l'utente abbia inserito il tag e il testo divisi da |
  if (!text) return m.reply(`🔮 *ᴇʟɪxɪʀ ʙᴏᴛ*\n\n💡 _Scrivi:_ ${usedPrefix + command} @user | messaggio\n_Esempio:_ ${usedPrefix + command} @${m.sender.split('@')[0]} | Sono un nabbo`);

  let [who, ...fakeText] = text.split('|');
  fakeText = fakeText.join('|').trim(); // Ricostruiamo il testo nel caso ci siano altri |

  if (!who || !fakeText) return m.reply(`⚠️ *Errore di formato!*\nUsa: ${usedPrefix + command} @user | testo`);

  // Puliamo l'ID dell'utente taggato
  let user = who.replace(/[@ ]/g, '') + '@s.whatsapp.net';

  // Creiamo il "messaggio fantasma" da citare
  let fakeObj = {
    key: {
      fromMe: false,
      participant: user,
      remoteJid: m.chat
    },
    message: {
      conversation: fakeText // Il testo che apparirà nella citazione
    }
  };

  // Il bot invia un messaggio di risposta a quel messaggio fasullo
  await conn.sendMessage(m.chat, { 
    text: `🤣🤣🤣 Non posso crederci che l'hai detto!`, 
    contextInfo: {
      mentionedJid: [user],
      // Qui inseriamo il messaggio fake come "quoted"
      externalAdReply: {
        title: `🎭 ELIXIR FAKE EXPOSED`,
        body: `Vittima: @${user.split('@')[0]}`,
        mediaType: 1,
        thumbnailUrl: 'https://ibb.co', // Immagine facoltativa
        renderLargerThumbnail: false
      }
    }
  }, { quoted: fakeObj });
};

handler.help = ['fake'];
handler.tags = ['fun'];
handler.command = /^(fake|finto|citazione)$/i;
handler.group = true;

export default handler;
