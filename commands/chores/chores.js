const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const {readChores, formatChores, completeChores} = require("../../choresUtilities")

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('chores')
		.setDescription('DMs you a list of your weekly and daily chores')
        .setDMPermission(true),
	async execute(interaction) {
        const chores = await readChores(interaction.user.id, interaction.user.username)
        if(chores["chores"].length != 0){
            const formattedChores = await formatChores(chores["chores"])
            const choresSelectOptionsList = [];
            const choresSelectOptionsList2 = [];
            let choreSelect2;
            let row0;
            //max amount of options in a string select menu is 25, make two of them if there is > 25
            if(chores["chores"].length <= 25){
                formattedChores.split("\n").forEach(c => {
                    if(c)
                        choresSelectOptionsList.push( new StringSelectMenuOptionBuilder().setLabel(c.substring(0,24)).setValue(c[0]))
                });
            }
            else{
                choreSelect2 = new StringSelectMenuBuilder()
                .setCustomId('choreSelect2')
                .setMinValues(0)
                .setMaxValues(choresSelectOptionsList2.length)
                .addOptions(choresSelectOptionsList2); 
                row0 = new ActionRowBuilder()
                        .addComponents([choreSelect2]);
            }
            
            const completeChoresButton = new ButtonBuilder()
                        .setCustomId("completeChores")
                        .setLabel("Complete a chore!")
                        .setStyle(ButtonStyle.Success)
            const choreSelect = new StringSelectMenuBuilder()
                .setCustomId('choreSelect')
                .setMinValues(0)
                .setMaxValues(choresSelectOptionsList.length)
                .addOptions(choresSelectOptionsList);                    
            const row1 = new ActionRowBuilder()
                        .addComponents([choreSelect]);
            const row2 = new ActionRowBuilder()
                        .addComponents([completeChoresButton]);

            let response;
            if(chores["chores"].length > 25){
                response = await interaction.reply({content: formattedChores, components: [row0, row1, row2]});
            }
            else{
                response = await interaction.reply({content: formattedChores, components: [row1, row2]});
            }
            

            const componentCollector = response.createMessageComponentCollector();
            let choresToComplete;
            componentCollector.on('collect', async i => {
                try {
                    if (i.customId === 'completeChores') {
                        if(choresToComplete){
                            const res = await completeChores(interaction.user.id, choresToComplete, chores)
                            i.reply(`Congratulations on completing chore(s) #${choresToComplete}! Keep up the good work!`)
                            const reformattedChores = await formatChores(chores["chores"])
                            interaction.editReply({content: reformattedChores, components: [row1, row2]})
                        }
                        else{
                            i.deferUpdate()
                        }
                    }
                    else if(i.customId === 'choreSelect' || i.customId === 'choreSelect2'){
                        choresToComplete = i.values
                        i.deferUpdate()
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        }
        else{
            await interaction.reply("No chores added yet, please use the /addchores command first!")
        }
	},
};