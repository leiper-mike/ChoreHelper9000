const {
     SlashCommandBuilder,
     ActionRowBuilder,
     ButtonBuilder,
     ButtonStyle,
     ModalBuilder,
     StringSelectMenuBuilder,
     StringSelectMenuOptionBuilder,
} = require("discord.js");
const { readChores, formatChores, completeChores, removeChores } = require("../../choresUtilities");

module.exports = {
     cooldown: 5,
     data: new SlashCommandBuilder().setName("chores").setDescription("DMs you a list of your weekly and daily chores").setDMPermission(true),
     async execute(interaction) {
          const chores = await readChores(interaction.user.id, interaction.user.username);
          if (chores["chores"].length != 0) {
               const formattedChores = await formatChores(chores["chores"]);
               const choresSelectOptionsList = [];
               const choresSelectOptionsList2 = [];
               let choreSelect2;
               let row0;
               //max amount of options in a string select menu is 25, make two of them if there is > 25
               if (chores["chores"].length <= 25) {
                    formattedChores.split("\n").forEach((c) => {
                         if (c) choresSelectOptionsList.push(new StringSelectMenuOptionBuilder().setLabel(c.substring(0, 24)).setValue(c[0]));
                    });
               } else {
                    choreSelect2 = new StringSelectMenuBuilder()
                         .setCustomId("choreSelect2")
                         .setMinValues(0)
                         .setMaxValues(choresSelectOptionsList2.length)
                         .addOptions(choresSelectOptionsList2);
                    row0 = new ActionRowBuilder().addComponents([choreSelect2]);
               }

               const completeChoresButton = new ButtonBuilder()
                    .setCustomId("completeChores")
                    .setLabel("Complete a chore!")
                    .setStyle(ButtonStyle.Success);
               const removeChoresButton = new ButtonBuilder().setCustomId("removeChores").setLabel("Remove a chore").setStyle(ButtonStyle.Danger);
               const choreSelect = new StringSelectMenuBuilder()
                    .setCustomId("choreSelect")
                    .setMinValues(0)
                    .setMaxValues(choresSelectOptionsList.length)
                    .addOptions(choresSelectOptionsList);
               const row1 = new ActionRowBuilder().addComponents([choreSelect]);
               const row2 = new ActionRowBuilder().addComponents([completeChoresButton, removeChoresButton]);

               let response;
               if (chores["chores"].length > 25) {
                    response = await interaction.reply({
                         content: formattedChores,
                         components: [row0, row1, row2],
                    });
               } else {
                    response = await interaction.reply({
                         content: formattedChores,
                         components: [row1, row2],
                    });
               }

               const componentCollector = response.createMessageComponentCollector();
               let choresToComplete;
               componentCollector.on("collect", async (i) => {
                    try {
                         if (i.customId === "choreSelect" || i.customId === "choreSelect2") {
                              choresToComplete = i.values;
                              i.deferUpdate();
                         } else if (i.customId === "completeChores") {
                              if (choresToComplete) {
                                   await completeChores(interaction.user.id, choresToComplete, chores);
                                   i.reply(`Congratulations on completing chore(s) #${choresToComplete}! Keep up the good work!`);
                                   const reformattedChores = await formatChores(chores["chores"]);
                                   interaction.editReply({
                                        content: reformattedChores,
                                        components: [row1, row2],
                                   });
                              } else {
                                   i.deferUpdate();
                              }
                         } else if (i.customId === "removeChores") {
                              if (choresToComplete) {
                                   i.deferUpdate();
                                   const confirmButton = new ButtonBuilder()
                                        .setCustomId("confirm")
                                        .setLabel("Delete chores")
                                        .setStyle(ButtonStyle.Danger);
                                   const cancelButton = new ButtonBuilder()
                                        .setCustomId("cancel")
                                        .setLabel("Cancel deletion")
                                        .setStyle(ButtonStyle.Secondary);
                                   const row = new ActionRowBuilder().setComponents([confirmButton, cancelButton]);
                                   const channel = interaction.client.channels.cache.get(interaction.channelId);
                                   const res = await channel.send({
                                        content: `Are you sure you want to remove chore(s) # ${choresToComplete}? This action is irreversible.`,
                                        components: [row],
                                   });
                                   const confirmationCollector = res.createMessageComponentCollector();
                                   confirmationCollector.on("collect", async (inter) => {
                                        try {
                                             if (inter.customId === "confirm") {
                                                  await removeChores(interaction.user.id, choresToComplete, chores);
                                                  await inter.reply(`Deleted chore(s) #${choresToComplete}`);

                                                  const reformattedChores = await formatChores(chores["chores"]);
                                                  interaction.editReply({
                                                       content: reformattedChores,
                                                       components: [row1, row2],
                                                  });
                                             } else if (inter.customId === "cancel") {
                                                  inter.deleteReply();
                                                  //inter.reply("Canceled.");
                                             }
                                        } catch (error) {
                                             console.log(error);
                                        }
                                   });
                              } else {
                                   i.deferUpdate();
                              }
                         }
                    } catch (e) {
                         console.log(e);
                    }
               });
          } else {
               await interaction.reply("No chores added yet, please use the /addchores command first!");
          }
     },
};
