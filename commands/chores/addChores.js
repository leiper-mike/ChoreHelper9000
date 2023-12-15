const {
     SlashCommandBuilder,
     ActionRowBuilder,
     ButtonBuilder,
     ButtonStyle,
     StringSelectMenuBuilder,
     StringSelectMenuOptionBuilder,
     PermissionFlagsBits,
} = require("discord.js");
const { addChore, readChores } = require("../../choresUtilities");

module.exports = {
     cooldown: 5,
     data: new SlashCommandBuilder()
          .setName("addchores")
          .setDescription("Add a new Chore!")
          .setDMPermission(true)
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          .addStringOption((option) => option.setName("input").setDescription("Enter the chore").setRequired(true)),
     async execute(interaction) {
          const choreFrequencySelect = new StringSelectMenuBuilder()
               .setCustomId("choreFrequencySelect")
               .addOptions(
                    new StringSelectMenuOptionBuilder()
                         .setLabel("Daily")
                         .setDescription("This chore is to be completed once a day")
                         .setValue("daily"),
                    new StringSelectMenuOptionBuilder()
                         .setLabel("Weekly")
                         .setDescription("This chore is to be completed once a week")
                         .setValue("weekly"),
                    new StringSelectMenuOptionBuilder()
                         .setLabel("Specific")
                         .setDescription("This chore is to be completed on specific days of the week")
                         .setValue("specific")
               );
          const choreDaysSelect = new StringSelectMenuBuilder()
               .setCustomId("choreDaySelect")
               .setMinValues(0)
               .setMaxValues(7)
               .addOptions(
                    new StringSelectMenuOptionBuilder().setLabel("Monday").setDescription("Monday").setValue("Monday"),
                    new StringSelectMenuOptionBuilder().setLabel("Tuesday").setDescription("Tuesday").setValue("Tuesday"),
                    new StringSelectMenuOptionBuilder().setLabel("Wednesday").setDescription("Wednesday").setValue("Wednesday"),
                    new StringSelectMenuOptionBuilder().setLabel("Thursday").setDescription("Thursday").setValue("Thursday"),
                    new StringSelectMenuOptionBuilder().setLabel("Friday").setDescription("Friday").setValue("Friday"),
                    new StringSelectMenuOptionBuilder().setLabel("Saturday").setDescription("Saturday").setValue("Saturday"),
                    new StringSelectMenuOptionBuilder().setLabel("Sunday").setDescription("Sunday").setValue("Sunday")
               );
          const submitButton = new ButtonBuilder().setCustomId("submitChores").setLabel("Submit Chore!").setStyle(ButtonStyle.Success);
          const row2 = new ActionRowBuilder().addComponents(choreFrequencySelect);
          const row3 = new ActionRowBuilder().addComponents(choreDaysSelect);
          const row4 = new ActionRowBuilder().addComponents(submitButton);

          const channel = interaction.client.channels.cache.get(interaction.channelId);
          const response = await interaction.reply({
               content: "Please select the frequency of the chore (if specific, specify the days in the last drop down) and submit!",
               components: [row2, row4],
          });
          //collecting user input

          let choreName = interaction.options.getString("input");
          let choreFrequency = "daily";
          let daysEnabled = false;
          let choreDays;

          const componentCollector = response.createMessageComponentCollector();

          componentCollector.on("collect", async (i) => {
               try {
                    if (i.customId === "submitChores") {
                         if (choreName && ((choreFrequency == "specific" && choreDays) || choreFrequency != "specific")) {
                              const choresJSON = await readChores(i.user.id, i.user.username);
                              const res = await addChore(i.user.id, choreName, choreFrequency, choreDays, choresJSON);
                              if (res == 1) await i.reply(`Chore added, with name: ${choreName}, and frequency: ${choreFrequency}`);
                              else await i.deferReply();
                         }
                    } else if (i.customId === "choreFrequencySelect") {
                         choreFrequency = i.values[0];
                         if (choreFrequency == "specific") {
                              daysEnabled = true;
                              await interaction.editReply({
                                   content: "Please select the frequency of the chore (if specific, specify the days in the last drop down) and submit!",
                                   components: [row2, row3, row4],
                              });
                              await i.deferUpdate();
                         } else if (daysEnabled) {
                              daysEnabled = false;
                              await interaction.editReply({
                                   content: "Please select the frequency of the chore (if specific, specify the days in the last drop down) and submit!",
                                   components: [row2, row4],
                              });
                              await i.deferUpdate();
                         } else {
                              await i.deferUpdate();
                         }
                    } else if (i.customId === "choreDaySelect") {
                         choreDays = i.values;
                         await i.deferUpdate();
                    }
               } catch (e) {
                    console.log(e);
               }
          });
     },
};
