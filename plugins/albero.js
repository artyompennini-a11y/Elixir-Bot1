// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');
if (!fs.existsSync(path.dirname(marriagesFile))) fs.mkdirSync(path.dirname(marriagesFile), { recursive: true });

// --- UTILS DATABASE ---
const loadMarriages = () => {
    try { return fs.existsSync(marriagesFile) ? JSON.parse(fs.readFileSync(marriagesFile, 'utf8')) : {}; } 
    catch (e) { return {}; }
}
const saveMarriages = (data) => fs.writeFileSync(marriagesFile, JSON.stringify(data, null, 2));

const checkUser = (id) => {
    if (!id) return
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let u = global.db.data.users[id]
    if (!Array.isArray(u.p)) u.p = [] 
    if (u.s === undefined) u.s = null 
}

// --- HANDLER ---
let handler = async (m, { conn, command, usedPrefix }) => {
    let user = m.sender;
    checkUser(user);
    let marriages = loadMarriages();

    // --- ALBERO GENEALOGICO (TESTO) ---
    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : user);
        checkUser(target);
        await m.reply('`⏳ Le cronache del regno stanno tracciando la tua stirpe...`');

        let u = global.db.data.users[target];
        let partner = marriages[target];
        let padre = u.s;
        let figli = u.p || [];

        let txt = `🌳 *ALBERO GENEALOGICO* 🌳\n\n`;
        let mentions = [];

        // Intestazione
        let targetName = '@' + target.split('@')[0];
        txt += `👤 *Soggetto:* ${targetName}\n`;
        mentions.push(target);

        // Genitore
        if (padre) {
            let padreName = '@' + padre.split('@')[0];
            txt += `\n👨‍👧 *Genitore:* ${padreName}`;
            mentions.push(padre);
        } else {
            txt += `\n👨‍👧 *Genitore:* ❌ Nessuno (non adottato)`;
        }

        // Partner
        if (partner) {
            let partnerName = '@' + partner.split('@')[0];
            txt += `\n💍 *Partner:* ${partnerName}`;
            mentions.push(partner);
        } else {
            txt += `\n💍 *Partner:* ❌ Nessuno (non sposato)`;
        }

        // Figli
        txt += `\n\n👶 *Figli:*`;
        if (figli.length > 0) {
            for (let i = 0; i < figli.length; i++) {
                let figlio = '@' + figli[i].split('@')[0];
                txt += `\n   ${i + 1}. ${figlio}`;
                mentions.push(figli[i]);
            }
        } else {
            txt += `\n   ❌ Nessun figlio`;
        }

        txt += `\n\n━━━━━━━━━━━━━━━━━\n_I legami di ${targetName} sono scritti tra le stelle._ ✨`;

        return conn.sendMessage(m.chat, { text: txt, mentions: mentions }, { quoted: m });
    }

    // --- MATRIMONIO ---
    if (command === 'sposa') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Devi indicare a chi vuoi donare il tuo cuore.`');
        if (marriages[user] || marriages[target]) return m.reply('`⚠️ I vostri cuori appartengono già ad altri rami...`');
        
        global.marriage_proposals = global.marriage_proposals || {};
        global.marriage_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.marriage_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettasposa`, buttonText: { displayText: 'Sì, ti scelgo 💍' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'Non ora... ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `💍 *UNA PROMESSA DI ETERNITÀ*\n\n@${user.split('@')[0]} ha chiesto la tua mano @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettasposa') {
        let prop = global.marriage_proposals[user];
        if (!prop || user !== prop.target) return;
        marriages[user] = prop.proposer; marriages[prop.proposer] = user;
        saveMarriages(marriages); clearTimeout(prop.timeout); delete global.marriage_proposals[user];
        return m.reply('✨ *Le campane suonano all\'unisono! Da oggi le vostre anime sono intrecciate in un legame sacro.* 💖');
    }

    if (command === 'divorzia') {
        let p = marriages[user];
        if (!p) return m.reply('`⚠️ Non sei vincolato a nessuno sposo.`');
        delete marriages[user]; delete marriages[p];
        saveMarriages(marriages);
        return m.reply('💔 *L\'INCANTO SI È SPEZZATO...* \n\nLe vostre strade si dividono qui. Quello che un tempo era un "noi", ora torna ad essere solo polvere e ricordi.');
    }

    // --- ADOZIONE ---
    if (command === 'adotta') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Chi cerchi di accogliere sotto la tua protezione?`');
        checkUser(target);
        if (global.db.data.users[target].s) return m.reply('`❌ Questa persona ha già un genitore.`');
        
        global.adoption_proposals = global.adoption_proposals || {};
        global.adoption_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.adoption_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettaadozione`, buttonText: { displayText: 'Accetta la famiglia 🍼' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'Resto solo ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `👶 *IL CALORE DI UNA FAMIGLIA*\n\n@${user.split('@')[0]} vorrebbe adottarti @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettaadozione') {
        let prop = global.adoption_proposals[user];
        if (!prop || user !== prop.target) return;
        let genitore = prop.proposer;
        checkUser(genitore);
        global.db.data.users[genitore].p.push(user);
        global.db.data.users[user].s = genitore;
        clearTimeout(prop.timeout); delete global.adoption_proposals[user];
        return m.reply(`🍼 *Benvenuto a casa! @${user.split('@')[0]} è stato ufficialmente adottato. Una nuova alba per questa famiglia!* ✨`);
    }

    if (command === 'disereda') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target) return m.reply('`⚠️ Chi deve essere allontanato dal focolare?`');
        let u = global.db.data.users[user];
        if (!u.p.includes(target)) return m.reply('`❌ Questo sangue non appartiene alla tua lista dei figli.`');
        u.p = u.p.filter(id => id !== target);
        global.db.data.users[target].s = null;
        return conn.sendMessage(m.chat, { text: `🚫 *L'ALBERO È STATO RECISO...* \n\nCon un atto severo, @${target.split('@')[0]} è stato rimosso dalla dinastia.`, mentions: [target] }, { quoted: m });
    }

    if (command === 'rifiuta') {
        if (global.marriage_proposals[user] && user === global.marriage_proposals[user].target) {
            delete global.marriage_proposals[user];
            return m.reply('💔 *La proposta è stata rifiutata. Un cuore rimane solitario...*');
        }
        if (global.adoption_proposals[user] && user === global.adoption_proposals[user].target) {
            delete global.adoption_proposals[user];
            return m.reply('🥀 *L\'invito è stato declinato. Il viaggio continua in solitudine.*');
        }
    }
}

handler.help = ['albero', 'sposa', 'adotta', 'disereda', 'divorzia']
handler.tags = ['famiglia']
handler.command = /^(famiglia|albero|famigliamia|sposa|accettasposa|accettaadozione|rifiuta|adotta|divorzia|disereda)$/i

export default handler
