# Discord To Fortnite Status

# How to setup:
### - Requirements:

• **Node.js v16.9.0 or above.** <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/v16.9.0-100000?style=flat&logo=node.js&label=Node.js&color=blue&logoColor=lime"></a><br>
• **Discord.js v14.3.0 or above**. <a href="https://www.npmjs.com/package/discord.js"><img src="https://img.shields.io/badge/v14.3.0-100000?style=flat&logo=npm&label=Discord.js&color=blue"></a>

### - Creating a new client and inviting the bot:
• 1- Go to [Discord Developer Portal](https://discord.com/developers) and then go to `Applications`. <br>
• 2- Create a new application and choose it's name. <br>
• 3- Put your application's avatar (not important).<br>
• 4- Go to `Bot` section and turn your application into a bot. <br>
• 5- Scroll down and enable the three disabled `Privileged Gateaway Intents` intents (`PRESENCE INTENT`, `SERVER MEMBERS INTENT`, and `MESSAGE CONTENT INTENT`).<br>
• 6- Go to `OAuth2` section, and then `URL Generator`. Select the scopes `bot` and `application.commands`, and then scroll down to **Bot Permissions**, select `Administrator` (For all guild permissions). Copy the link that is generated below, open a new browser tab, paste the URL, choose a server where your bot will be in, verify yourself that you are not a robot, and Done!

### - Setting up your config file:
• 1 - Go to the folder `config`, and then the file `config.json`. Fill or change the values of the variables as you want. Here's the config.json code below, replace.
```json
  "DISCORD_ID": "YOUR DISCORD_ID",
  "FORTNITE_ID": "YOUR FORTNITE_ID",
  "ACCESS_TOKEN": "YOUR ACCESS_TOKEN",
  "SERVER_ID": "YOUR SERVER ID (that you and the bot is in)"
```
# Update discord.js package version:
Go to shell or terminal and type `npm i discord.js@latest`.

# What is MongoDB and Quick.db?
MongoDB is a database program. You can save some documents, data, and more! The official site of MongoDB is linked [here](https://www.mongodb.com/).<br>
Quick.db is also a database program, more simplified than MongoDB but doesn't have a lot features. Quick.db uses SQlite files to save data, but MongoDB uses clusters (or Mongo URI) to save data. You can get more information about these both databases in Google.

# Something doesn't work here...
There are a lot of issues happens with some users. You can create an issue on this repository and I will respond to your opened issue(s) as fast as possible. I'm always busy, so please wait for me to respond to your issues.

# Credits are required? (©)
Forking this repository and sharing it again without giving credits to me (T.F.A).

### Contact me!
<a href='https://discord.gg/dub' target="_blank">
    <img alt='Discord' src='https://img.shields.io/badge/Discord-100000?style=social&logo=Discord&logoColor=5865F2&labelColor=000000&color=EAE9E9'/>
</a>
