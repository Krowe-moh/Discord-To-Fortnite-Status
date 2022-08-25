const { Client, IntentsBitField } = require('discord.js');
const XMPP = require("stanza")
const crypto = require("crypto")
require('dotenv').config()
const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.Guilds);
const client = new Client({ intents: myIntents });
const { deviceGenerate } = require('./functions.js')
let xmppclient
const access = deviceGenerate()
client.once('ready', () => {
console.log("Discord Status Set")
  const abusedServer = client.guilds.fetch(process.env.SERVER_ID);
  abusedServer.then(function(result1) {
    result1.members.fetch(process.env.DISCORD_ID).then(function(result) {
      let status;
      if (result.presence.activities[0]?.state !== undefined) {
        status = result.presence.activities[0]?.state
      } else {
        if (result.presence.activities[1]?.name !== undefined) {
          status = `Playing ` + result.presence.activities[1].name
        } else {
          status = `No Discord Status`
        }
      }
      if (!status) status == " ";
      xmppclient = XMPP.createClient({
        jid: access.account_id + "@prod.ol.epicgames.com",
        transports: {
          websocket: `wss://xmpp-service-prod.ol.epicgames.com`,
          bosh: false,
        },
        credentials: {
          host: "prod.ol.epicgames.com",
          username: access.account_id,
          password: access.access_token,
        },
        resource: `V2:Fortnite:PC::${crypto.randomBytes(16).toString('hex').toUpperCase()}`
      })
      xmppclient.on('session:started', () => {
        xmppclient.getRoster();
        xmppclient.sendPresence({
          status: status,
          onlineType: "online",
          bIsPlaying: true,
          ProductName: "Fortnite"
        })
      })
      xmppclient.connect();
    })
  })
})
client.on('presenceUpdate', function(oldPresence, newPresence) {
  if (process.env.DISCORD_ID === undefined && newPresence.user.id === process.env.DISCORD_ID) return;
  if (!newPresence === oldPresence) return;
  let status;
  if (newPresence.member.presence.activities[0]?.state !== undefined) {
    status = newPresence.member.presence.activities[0]?.state
  } else {
    if (newPresence.member.presence.activities[1]?.name !== undefined) {
      status = `Playing ` + newPresence.member.presence.activities[1].name
    } else {
      status = `No Discord Status`
    }
  }
  if (!status) status == " ";
  xmppclient?.disconnect();
  xmppclient = XMPP.createClient({
    jid: access.account_id + "@prod.ol.epicgames.com",
    transports: {
      websocket: `wss://xmpp-service-prod.ol.epicgames.com`,
      bosh: false,
    },
    credentials: {
      host: "prod.ol.epicgames.com",
      username: access.account_id,
      password: access.access_token,
    },
    resource: `V2:Fortnite:PC::${crypto.randomBytes(16).toString('hex').toUpperCase()}`
  })
  xmppclient.on('session:started', () => {
    xmppclient.getRoster();
    xmppclient.sendPresence({
      status: status,
      onlineType: "online",
      bIsPlaying: true,
      ProductName: "Fortnite"
    })
  })
  xmppclient.connect();
})
client.login(process.env.BOT_TOKEN);
