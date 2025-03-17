const { Client, IntentsBitField } = require('discord.js');
const { deviceGenerate } = require('./functions.js');
const XMPP = require("stanza");
const crypto = require("crypto");
require('dotenv').config();
const chalk = require("chalk");

function log(level, message, color = "white") {
    const timestamp = new Date().toISOString();
    const formattedMessage = `\n[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(chalk[color](formattedMessage));
}

const myIntents = new IntentsBitField([
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.Guilds
]);

const client = new Client({ intents: myIntents });

async function main() {
    let xmppClient;

    try {
        log("INFO", "Initializing device authentication...", "yellow");
        const access = await deviceGenerate();

        client.once('ready', async () => {
            log("SUCCESS", "Discord bot is ready!", "green");
            
            try {
                const server = await client.guilds.fetch(process.env.SERVER_ID);
                const member = await server.members.fetch(process.env.DISCORD_ID);

                let status = extractStatus(member.presence);
                log("INFO", `Initial status: ${status}`, "blue");

                xmppClient = setupXmppClient(access, status);
                xmppClient.connect();
            } catch (error) {
                log("ERROR", `Failed to fetch Discord presence: ${error.message}`, "red");
                process.exit(1);
            }
        });

        client.on('presenceUpdate', async (_, newPresence) => {
            if (newPresence.user.id !== process.env.DISCORD_ID) return;

            let newStatus = extractStatus(newPresence);
            log("INFO", `Presence updated: ${newStatus}`, "blue");

            if (xmppClient) {
                await xmppClient.disconnect();
                log("INFO", "Old XMPP client disconnected", "yellow");
            }

            xmppClient = setupXmppClient(access, newStatus);
            xmppClient.connect();
        });

    } catch (error) {
        log("ERROR", `Critical error: ${error.message}`, "red");
        process.exit(1);
    }
}

function extractStatus(presence) {
    if (!presence) return "No Discord Status";

    const activities = presence.activities || [];
    const primaryActivity = activities.find(activity => activity.applicationId) || activities[0];
    console.log(primaryActivity)
    return primaryActivity?.name 
        ? `Playing ${primaryActivity.name}` 
        : primaryActivity?.state || "No Discord Status";
}

function setupXmppClient(access, status) {
    const jid = `${access.account_id}@prod.ol.epicgames.com`;
    const resource = `V2:Fortnite:PC::${crypto.randomBytes(16).toString('hex').toUpperCase()}`;

    log("INFO", "Setting up XMPP client...", "cyan");

    const client = XMPP.createClient({
        jid,
        transports: { websocket: "wss://xmpp-service-prod.ol.epicgames.com", bosh: false },
        credentials: { host: "prod.ol.epicgames.com", username: access.account_id, password: access.access_token },
        resource
    });

    client.on('session:started', () => {
        client.getRoster();
        client.sendPresence({
            status,
            onlineType: "online",
            bIsPlaying: true,
            ProductName: "Fortnite"
        });
        log("SUCCESS", "XMPP session started, presence sent", "green");
    });

    client.on('disconnected', () => {
        log("WARNING", "XMPP client disconnected", "yellow");
    });

    client.on('error', (err) => {
        log("ERROR", `XMPP error: ${err.message}`, "red");
    });

    return client;
}

client.login(process.env.BOT_TOKEN)
    .catch(() => {
        log("ERROR", "Invalid bot token! Exiting...", "red");
        process.exit(1);
    });

main();
