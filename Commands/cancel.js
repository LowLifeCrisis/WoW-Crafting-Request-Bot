const { run, get } = require('../utils/db');

// commands/cancel.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancel an existing crafting order')
    .addStringOption(option =>
      option
        .setName('order_id')
        .setDescription('The ID of the order to cancel')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Grab the order ID from the user
    const orderId = interaction.options.getString('order_id');

   // 1️⃣ Check the order exists
const order = await get(`SELECT * FROM orders WHERE id = ?`, orderId);
if (!order) {
  return interaction.reply({ content: `❌ No order ${orderId} found.`});
}

// 2️⃣ Update status
await run(`UPDATE orders SET status = ? WHERE id = ?`, 'cancelled', orderId);

    await interaction.reply({
      content: `❌ Order \`${orderId}\` has been cancelled. You've been charged 400$, go with honor friend.`,
    });

    // Notify your craft-orders channel (optional)
    //const craftChannel = interaction.guild.channels.cache
    //  .find(ch => ch.isTextBased() && ch.name === 'craft-orders');
    //if (craftChannel) {
      //await craftChannel.send(
        //`❌ Order \`${orderId}\` was cancelled by ${interaction.user.toString()}.`
      //);
    //}
  }
};