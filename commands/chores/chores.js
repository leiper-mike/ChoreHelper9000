const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder } = require('discord.js');
const {readChores, formatChores} = require("../../choresUtilities")

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('chores')
		.setDescription('DMs you a list of your weekly and daily chores')
        .setDMPermission(true),
	async execute(interaction) {
        const chores = await readChores(interaction.user.id, interaction.user.username)
        const formattedChores = await formatChores(chores["chores"])
        const addChoresButton = new ButtonBuilder()
                    .setCustomId("addChores")
                    .setLabel("Add Chores")
                    .setStyle(ButtonStyle.Primary)
        const completeChoresButton = new ButtonBuilder()
                    .setCustomId("completeChoresModal")
                    .setLabel("Complete a chore!")
                    .setStyle(ButtonStyle.Success)                    
        const row = new ActionRowBuilder()
                    .addComponents([addChoresButton, completeChoresButton]);



		await interaction.reply({content: formattedChores, components: [row]});
	},
};