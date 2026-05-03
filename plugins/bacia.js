import { createCanvas } from 'canvas';

globalThis.baciRank = globalThis.baciRank || {};

let handler = async (m, { conn }) => {
  let sender = m.sender;
  let target = null;

  if (m.mentionedJid && m.mentionedJid[0]) {
    target = m.mentionedJid[0];
  } else if (m.quoted && m.quoted.sender) {
    target = m.quoted.sender;
  } else {
    return m.reply("Devi menzionare qualcuno o rispondere al suo messaggio per dargli un bacio! 💋");
  }


  // --- LOGICA RANKING E FRASI ---
  const frasi = [
    `@${sender.split("@")[0]} ha dato un bacio travolgente a @${target.split("@")[0]}! 💋`,
    `Un bacio dolcissimo da @${sender.split("@")[0]} per @${target.split("@")[0]}! ✨`,
    `@${sender.split("@")[0]} ha appena baciato @${target.split("@")[0]} davanti a tutti! 😳`,
    `Muah! @${sender.split("@")[0]} lancia un bacio speciale a @${target.split("@")[0]}! 💖`
  ];

  const fraseRandom = frasi[Math.floor(Math.random() * frasi.length)];
  
  if (!globalThis.baciRank[target]) globalThis.baciRank[target] = 0;
  globalThis.baciRank[target] += 1;

  const testoFinale = `${fraseRandom}\n\n💋 Baci totali ricevuti da @${target.split("@")[0]}: ${globalThis.baciRank[target]}`;

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: testoFinale,
    mentions: [sender, target]
  }, { quoted: m });
};

handler.help = ['bacia'];
handler.tags = ['giochi'];
handler.command = /^(bacia|kiss)$/i;
handler.group = true;

export default handler;
