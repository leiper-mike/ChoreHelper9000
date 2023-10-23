import dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ModalBuilder} from 'discord.js'

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages, // for testing
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.login(process.env.DISCORD_TOKEN);

const testBtn = new ButtonBuilder()
                    .setCustomId("test")
                    .setLabel("This is a test button")
                    .setStyle(ButtonStyle.Primary)


client.on("messageCreate", async (message) => {

    if(!message.author.bot){
        message.author.send({
            content: 'This is a test message',
            components: [testBtn]
        })
    }
});
