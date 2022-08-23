const WebSocket = require('ws')
const XMPP = require("stanza") 
const crypto = require("crypto")
const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
require("dotenv").config();
      const payload = {
      	op: 2,
      	d: {
      		token: process.env.BOT_TOKEN,
      		properties: {
      			$os: "linux",
      			$browser: "chrome",
      			$device: "chrome",
      		},
      	},
      };
      ws.on("open", () => {
      	ws.send(JSON.stringify(payload));
      });
      ws.on("message", (data) => {
      	let payload = JSON.parse(data);
      	const { t, event, op, d	} = payload;
      	switch(op) {
      		case 10:
      			const {	heartbeat_interval } = d;
      			interval = heartbeat(heartbeat_interval);
      			console.log("Websocket Has Started");
      			break;
      	}
      	switch(t) {
      		case "PRESENCE_UPDATE":
      			if(!d.user.id === process.env.DISCORD_ID) return;
      				let onlineType = d.status
      				let status = d.game.state
      				if(d.status === "idle") onlineType == "away";
      				if(!d?.game) status == " ";
      				const client = XMPP.createClient({
      					jid:process.env.FORTNITE_ID + "@prod.ol.epicgames.com",
      					transports: {
      						websocket: `wss://xmpp-service-prod.ol.epicgames.com`,
      						bosh: false,
      					},
      					credentials: {
      						host: "prod.ol.epicgames.com",
      						username: process.env.FORTNITE_ID,
      						password: process.env.ACCESS_TOKEN,
      					},
      					resource: `V2:Fortnite:PC::${crypto.randomBytes(16).toString('hex').toUpperCase()}`
      				});
      				client.on('session:started', () => {
      					client.getRoster();
      					client.sendPresence({
      						status: status,
      						onlineType: onlineType, 
                                          bIsPlaying: true, 
                                          ProductName: "Fortnite"
      					})
      				})
                              client.connect();
      			}
      	}
      });
      const heartbeat = (ms) => {
      	return setInterval(() => {
      		ws.send(JSON.stringify({
      			op: 1,
      			d: null
      		}));
      	}, ms);
      };
