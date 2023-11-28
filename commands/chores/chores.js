const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder } = require('discord.js');
const {readChores} = require("../../choresUtilities")

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('chores')
		.setDescription('DMs you a list of your weekly and daily chores')
        .setDMPermission(true),
	async execute(interaction) {
        const chores = await readChores(interaction.user.id)
        const row = new ActionRowBuilder()
	    .addComponents(component);



		await interaction.reply({components: [row]});
	},
};