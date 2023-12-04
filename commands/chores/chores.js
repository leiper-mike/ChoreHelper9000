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
        const completeChoresButton = new ButtonBuilder()
                    .setCustomId("completeChores")
                    .setLabel("Complete a chore!")
                    .setStyle(ButtonStyle.Success)                    
        const row = new ActionRowBuilder()
                    .addComponents([completeChoresButton]);



		const response = await interaction.reply({content: formattedChores, components: [row]});

        const componentFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: componentFilter, time: 60_000 });
			if (confirmation.customId === 'completeChores') {

            }
		} catch (e) {
			console.log(e)
		}
	},
};