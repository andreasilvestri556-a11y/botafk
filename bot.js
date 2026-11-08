const mineflayer = require('mineflayer')
const readline = require('readline')

// ==========================================
// CONFIGURAZIONE DEL BOT E DEL SERVER
// ==========================================
const SERVER_IP = 'templarmc.aternos.me' // Il tuo IP Aternos
const SERVER_PORT = 25565
const BOT_USERNAME = 'Bot_AFK'
const BOT_PASSWORD = 'afk123' // Password predefinita per l'autologin

let bot

function createBotInstance() {
  bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    auth: 'offline',
    physics: false, // Mantiene disattivata la fisica per evitare il flag flying
    defaultChatHandlers: false,
    checkTimeoutInterval: 60000
  })

  // --- EVENTI DI CONNESSIONE E LOG DI STATO ---
  bot.on('login', () => {
    console.log(`\n[+] [BOT] Connesso con successo al server come ${BOT_USERNAME}!`)
  })

  bot.on('spawn', () => {
    console.log('[+] [BOT] Entrato nel mondo di gioco.')
    
    // LOGIN AUTOMATICO ALL'INGRESSO
    setTimeout(() => {
      if (bot) {
        bot.chat(`/login ${BOT_PASSWORD}`)
        console.log(`[CMD] -> Eseguito login automatico: /login ${BOT_PASSWORD}`)
      }
    }, 1500) // Aspetta 1.5 secondi dallo spawn prima di inviare il comando
  })

  // --- MOSTRA LA CHAT E I MESSAGGI NEL TERMINALE ---
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`[Chat] <${username}> ${message}`)
  })

  bot.on('message', (jsonMsg) => {
    const text = jsonMsg.toString()
    if (text.trim() !== '') {
      console.log(`[Server] ${text}`)
    }
  })

  bot.on('kicked', (reason) => {
    console.log(`\n[!] [ATTENZIONE] Il bot è stato cacciato dal server. Motivo: ${reason}`)
  })

  bot.on('error', (err) => {
    console.log(`[!] [ERRORE BOT]:`, err)
  })
}

// ==========================================
// INTERFACCIA DI CONTROLLO DA TERMINALE (CMD)
// ==========================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('==================================================')
console.log('       CONTROLLO BOT MINECRAFT DA TERMINALE       ')
console.log('==================================================')
console.log(' - Login automatico attivo (/login afk123).')
console.log(' - Scrivi qualsiasi testo per mandarlo in chat o comandi.')
console.log(' - Digita "exit" o "quit" per chiudere il bot.')
console.log(' - Digita "reconnect" per forzare la riconnessione.')
console.log('==================================================\n')

rl.on('line', (line) => {
  const input = line.trim()
  if (input === '') return

  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
    console.log('[CMD] Chiusura del bot in corso...')
    if (bot) bot.quit()
    process.exit(0)
  }
  
  if (input.toLowerCase() === 'reconnect') {
    console.log('[CMD] Riconnessione forzata al server...')
    if (bot) bot.quit()
    setTimeout(createBotInstance, 2000)
    return
  }

  if (bot) {
    bot.chat(input)
    console.log(`[CMD Inviato] -> ${input}`)
  } else {
    console.log('[CMD] Il bot non è attualmente connesso.')
  }
})

// Avvio iniziale del bot
createBotInstance()