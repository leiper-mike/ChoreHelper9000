const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const {readChores} = require("../../choresUtilities")

module.exports = {
    cooldown: 5,
	data: {
        name: "addChores"
    },
	async execute(interaction) {
        const choreNameInput = new TextInputBuilder()
            .setCustomId('choreNameInput')
            .setLabel("Enter the chore below")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            ;
        const choreFrequencySelect = new StringSelectMenuBuilder()
			.setCustomId('choreFrequencySelect')
			.setPlaceholder('Daily')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Daily')
					.setDescription('This chore is to be completed once a day')
					.setValue('daily')
                    .setDefault(true),
				new StringSelectMenuOptionBuilder()
					.setLabel('Weekly')
					.setDescription('This chore is to be completed once a week')
					.setValue('weekly'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Specific')
					.setDescription('This chore is to be completed on specific days of the week')
					.setValue('specific'),
			);
        const choreDaysSelect = new StringSelectMenuBuilder()
			.setCustomId('choreDaySelect')
			.setPlaceholder('Daily')
            .setMinValues(0)
            .setMaxValues(7)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Monday')
					.setDescription('Monday')
					.setValue('Monday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Tuesday')
					.setDescription('Tuesday')
					.setValue('Tuesday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Wednesday')
					.setDescription('Wednesday')
					.setValue('Wednesday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Thursday')
					.setDescription('Thursday')
					.setValue('Thursday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Friday')
					.setDescription('Friday')
					.setValue('Friday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Saturday')
					.setDescription('Saturday')
					.setValue('Saturday'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Sunday')
					.setDescription('Sunday')
					.setValue('Sunday')
			);
        const submitButton = new ButtonBuilder()
            .setCustomId("submitChores")
            .setLabel("Submit Chore!")
            .setStyle(ButtonStyle.Success)
        const row1 = new ActionRowBuilder()
	    .addComponents(choreNameInput);
        const row2 = new ActionRowBuilder()
	    .addComponents(choreFrequencySelect);
        const row3 = new ActionRowBuilder()
	    .addComponents(choreDaysSelect);
        const row4 = new ActionRowBuilder()
	    .addComponents(submitButton);

		await interaction.reply({components:[row1,row2,row3,row4]});
	},
};