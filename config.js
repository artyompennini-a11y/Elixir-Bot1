import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import chalk from 'chalk'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import NodeCache from 'node-cache'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const moduleCache = new NodeCache({ stdTTL: 300 });

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ THE PUNISHER-BOT✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

global.sam = ['393784409415', '393514722317', '639750840641', '393206032199',]

global.owner = [
  ['393784409415', 'Elixir', true],
  ['393206032199', 'Punisher', true],
  ['25776236110', 'Riley', true],
  ['22793134748', 'Thepunishervoip3', true], 
  ['393792937749', 'Venom', true],
  ['962770035395', 'Thepunisherbot', true],
  ['639750840641', 'Elixir 63', true],
  ['992085856815', 'Momo', true],
  ['393759045901', 'Bluddown', true],
  ['33625415528', 'Thepunishervoip2', true],
  ['393501989497', 'Endy', true],
]

global.mods = ['393784409415', '639750840641', '393206032199']
global.prems = ['393784409415', '639750840641', '393206032199']



/*⭑⭒━━━✦❘༻🩸 INFO BOT 🕊️༺❘✦━━━⭒⭑*/

global.nomepack = 'THE PUNISHER-BOT'
global.nomebot = 'THE PUNISHER-BOT'
global.wm = 'THE PUNISHER-BOT'
global.autore = 'THE PUNISHER'
global.dev = 'THE PUNISHER'
global.testobot = `THE PUNISHER-BOT`
global.versione = pkg.version
global.errore = '*ERRORE INATTESO*, UTILIZZA IL COMANDO .segnala (errore) per contattare lo sviluppatore. contatto diretto: +393206032199'

/*⭑⭒━━━✦❘༻🌐 LINK 🌐༺❘✦━━━⭒⭑*/

global.repobot ='https//wa.me/393206032199'
global.gruppo = 'https://chat.whatsapp.com/DCZnWya0Zow1KfGQLeuZJ1'
global.insta = 'https://www.instagram.com/arty.340?igsh=ZGxranlrczNybHJ0'

/*⭑⭒━━━✦❘༻ MODULI ༺❘✦━━━⭒⭑*/

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

/*⭑⭒━━━✦❘🗝️ API KEYS 🌍༺❘✦━━━⭒⭑*/

global.APIKeys = { // le keys con scritto "varebot" vanno cambiate con keys valide
    spotifyclientid: 'varebot',
    spotifysecret: 'varebot',
    browserless: 'varebot',
    screenshotone: 'varebot',
    screenshotone_default: 'varebot',
    tmdb: 'varebot',
    gemini: 'varebot',
    ocrspace: 'varebot',
    assemblyai: 'varebot',
    google: 'varebot',
    googlex: 'varebot',
    googleCX: 'varebot',
    genius: 'varebot',
    unsplash: 'varebot',
    removebg: 'FEx4CYmYN1QRQWD1mbZp87jV',
    openrouter: 'varebot',
    lastfm: '36f859a1fc4121e7f0e931806507d5f9',
    sightengine_user: 'varebot',
    sightengine_secret: 'varebot'
};


/*⭑⭒━━━✦❘༻🪷 SISTEMA XP/EURO 💸༺❘✦━━━⭒⭑*/

global.multiplier = 1 // piu è alto piu è facile guardagnare euro e xp

/*⭑⭒━━━✦❘༻📦 RELOAD 📦༺❘✦━━━⭒⭑*/

let filePath = fileURLToPath(import.meta.url)
let fileUrl = pathToFileURL(filePath).href
const reloadConfig = async () => {
  const cached = moduleCache.get(fileUrl);
  if (cached) return cached;
  unwatchFile(filePath)
  console.log(chalk.bgHex('#3b0d95')(chalk.white.bold("File: 'config.js' Aggiornato")))
  const module = await import(`${fileUrl}?update=${Date.now()}`)
  moduleCache.set(fileUrl, module, { ttl: 300 });
  return module;
}
watchFile(filePath, reloadConfig)
