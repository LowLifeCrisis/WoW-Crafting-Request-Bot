// commands/list.js
const { all } = require('../utils/db');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all your pending orders'),

  async execute(interaction) {
    // Fetch all orders for this user
    const orders = await all(
      `SELECT id, item, quantity, status, created_at
       FROM orders
       WHERE userId = ?
       ORDER BY created_at DESC`,
      interaction.user.id
    );

    //  Build a response
    if (orders.length === 0) {
      return interaction.reply({ content: 'You have no orders.', ephemeral: true });
    }

    const lines = orders.map(o => {
        // choose an icon based on status
        let icon;
        if (o.status === 'complete') {
          icon = '✅';          // green checkmark
        } else if (o.status === 'cancelled') {
          icon = '❌';          // red cross
        } else {
          icon = '⌛';          // hourglass for pending
        }
  
        return `\`${o.id}\`: ${o.quantity}×${o.item} — *${o.status}* ${icon}`;
      });

    await interaction.reply({
      content: '**Your Orders:**\n' + lines.join('\n'),
     // ephemeral: true
    });
  }
};