# Discord To Fortnite Status

A script that changes your fortnite player status to your discord status. (doesn't work when online on fortnite)

# How to setup:

### - Creating a new client and inviting the bot:
• 1- Go to [Discord Developer Portal](https://discord.com/developers) and then go to `Applications`. <br>
• 2- Create a new application and choose it's name. <br>
• 3- Put your application's avatar (not important).<br>
• 4- Go to `Bot` section and turn your application into a bot. <br>
• 5- Scroll down and enable the three disabled `Privileged Gateaway Intents` intents (`PRESENCE INTENT`, `SERVER MEMBERS INTENT`, and `MESSAGE CONTENT INTENT`).<br>
• 6- Go to `OAuth2` section, and then `URL Generator`. Select the scopes `bot` and then scroll down to **Bot Permissions**, select `Administrator` (For all guild permissions). Copy the link that is generated below, open a new browser tab, paste the URL, choose a server where your bot will be in, verify yourself that you are not a robot, and Done!

### - Setting up your config file:
• 1 - Go to the file `config.json`. Fill or change the values of the variables as you want. Here's the config.json code below, replace.
```json
  "DISCORD_ID": "YOUR DISCORD_ID",
  "SERVER_ID": "YOUR SERVER ID (that you and the bot is in)",
  "BOT_TOKEN": "YOUR BOT TOKEN"
```
### - How To Get A Bearer Token:
1. Click [This Link](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code)
2. Copy The 32 Character Authorization Code That Looks Like This: `11223344556677889911223344556677`
3. Paste The Code You Copied Into The Console.


![preview](https://user-images.githubusercontent.com/27891447/188433562-627c7ba8-cf27-4e77-b44c-4fec84a7bc66.png)

### - Authorization Code Says Null:
Use [This Link](http://epicgames.com/id/logout?lang=en-US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Flogin%3FredirectUrl%3Dhttps%253A%252F%252Fwww.epicgames.com%252Fid%252Fapi%252Fredirect%253FclientId%253D3446cd72694c4a4485d81b77adbb2141%2526responseType%253Dcode)
If It Opens The Epic Games Website After Logging in use [This Link](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code)


![preview](https://user-images.githubusercontent.com/27891447/188433808-3118d444-b285-46da-b1bf-e6f4335fabbe.png)


### Have Any Questions?  Make Sure To Contact Us
join the [Discord server](https://discord.gg/dub) and we'll help you out!
 
### • Repository Created by Krowe moh & Rev
