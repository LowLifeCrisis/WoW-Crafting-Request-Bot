// commands/complete.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('complete')
    .setDescription('Mark an existing order as complete')
    .addStringOption(opt =>
      opt
        .setName('order_id')
        .setDescription('The ID of the order to mark complete')
        .setRequired(true)
    ),

  async execute(interaction) {
    const orderId = interaction.options.getString('order_id');

    // Update your DB (pseudo-code)
    // const updated = await db.markOrderComplete(orderId);
    // if (!updated) {
    //   return interaction.reply({
    //     content: `❌ No order found with ID \`${orderId}\`.`,
    //     ephemeral: true
    //   });
    // }

    // Acknowledge the user
    await interaction.reply({
      content: `✅ Order \`${orderId}\` has been marked **complete**.`,
      ephemeral: true
    });

    // Notify your orders channel
    const craftChan = interaction.guild.channels.cache
      .find(ch => ch.isTextBased() && ch.name === 'bot');
    if (craftChan) {
      craftChan.send(
        `✅ Order \`${orderId}\` completed by ${interaction.user.toString()}. You owe your life to me`
      );
    }
  }
};
