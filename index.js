const { Client, IntentsBitField } = require('discord.js');
const XMPP = require("stanza")
const crypto = require("crypto")
require('dotenv').config()
require('colors');
const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.Guilds);
const client = new Client({ intents: myIntents });
const { deviceGenerate } = require('./functions.js')
async function main() {
	let xmppclient;
	try {
		const access = await deviceGenerate()
		client.once('ready', () => {
			console.log("Status Now Ready And Set".blue.bold)
			const abusedServer = client.guilds.fetch(process.env.SERVER_ID);
			abusedServer.then(function(result1) {
				result1.members.fetch(process.env.DISCORD_ID).then(function(result) {
					let status;
					if(result.presence?.activities[0]?.applicationId) {
						if(result.presence?.activities[0]?.name !== undefined) {
							status = `Playing ` + result.presence.activities[0].name
						} else {
							status = `No Discord Status`
						}
					} else if(result.presence?.activities[1]?.applicationId) {
						if(result.presence?.activities[1]?.name !== undefined) {
							status = `Playing ` + result.presence.activities[1].name
						} else {
							status = `No Discord Status`
						}
					} else {
						if(result.presence?.activities[0]?.state) {
							status = result.presence.activities[0].state
						} else {
							status = `No Discord Status`
						}
					}
					console.log(`Status: ${status}`.blue.bold)
						//Set status using xmpp
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
			if(newPresence.user.id === process.env.DISCORD_ID) { // for some reason return doesn't wanna work
				console.log("Status Set".blue.bold)
				let status;
				if(newPresence?.activities[0]?.applicationId) {
					if(newPresence?.activities[0]?.name) {
						status = `Playing ` + newPresence.presence.activities[0].name
					} else {
						status = `No Discord Status`
					}
				} else if(newPresence?.activities[1]?.applicationId) {
					if(newPresence?.activities[1]?.name) {
						status = `Playing ` + newPresence.presence.activities[1].name
					} else {
						status = `No Discord Status`
					}
				} else {
					if(newPresence?.activities[0]?.state) {
						status = newPresence.activities[0].state
					} else {
						status = `No Discord Status`
					}
				}
				console.log(`Status: ${status}`.blue.bold)
					// Disconnecting xmpp and sending a new one 
				xmppclient?.disconnect();
				// Set status using xmpp
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
			}
		})
	} catch(error) {
		// Error handler
		console.log(`${error}`.red.bold)
		process.exit()
	}
}
main()
client.login(process.env.BOT_TOKEN);
