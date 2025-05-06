const { run, get } = require('../utils/db');
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

   // Check the order exists
const order = await get(`SELECT * FROM orders WHERE id = ?`, orderId);
if (!order) {
  return interaction.reply({ content: `❌ No order ${orderId} found.`, ephemeral: true });
}

// Update status
await run(`UPDATE orders SET status = ? WHERE id = ?`, 'complete', orderId);
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
