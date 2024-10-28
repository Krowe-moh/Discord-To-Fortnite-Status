const { Client, IntentsBitField } = require('discord.js');
const XMPP = require("stanza");
const crypto = require("crypto");
require('dotenv').config();
require('colors');

const myIntents = new IntentsBitField([
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.Guilds
]);

const client = new Client({ intents: myIntents });
const { deviceGenerate } = require('./functions.js');
async function main() {
    let xmppclient;

    try {
        const access = await deviceGenerate();

        client.once('ready', async () => {
            console.log("Status Now Ready And Set".blue.bold);

            const server = await client.guilds.fetch(process.env.SERVER_ID);
            const member = await server.members.fetch(process.env.DISCORD_ID);
            let status = extractStatus(member.presence);

            console.log(`Status: ${status}`.blue.bold);

            xmppclient = setupXmppClient(access, status);
            xmppclient.connect();
        });

        client.on('presenceUpdate', async (_, newPresence) => {
            if (newPresence.user.id === process.env.DISCORD_ID) {
                console.log("Status Set".blue.bold);

                const status = extractStatus(newPresence);
                console.log(`Status: ${status}`.blue.bold);

                xmppclient.disconnect();
                xmppclient = setupXmppClient(access, status);
                xmppclient.connect();
            }
        });
    } catch (error) {
        console.error(`${error}`.red.bold);
        process.exit(1);
    }
}

function extractStatus(presence) {
    const activities = presence?.activities || [];
    const primaryActivity = activities.find(activity => activity.applicationId) || activities[0];
    
    return primaryActivity?.name
        ? `Playing ${primaryActivity.name}`
        : primaryActivity?.state || "No Discord Status";
}

function setupXmppClient(access, status) {
    const jid = `${access.account_id}@prod.ol.epicgames.com`;
    const resource = `V2:Fortnite:PC::${crypto.randomBytes(16).toString('hex').toUpperCase()}`;

    const client = XMPP.createClient({
        jid,
        transports: { websocket: `wss://xmpp-service-prod.ol.epicgames.com`, bosh: false },
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
    });

    return client;
}

main();
client.login(process.env.BOT_TOKEN).catch(() => {
    throw "The Bot Token is Invalid";
});
