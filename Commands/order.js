// commands/order.js
const { SlashCommandBuilder } = require('discord.js');
const { run } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order')
    .setDescription('Place a crafting order')
    .addStringOption(opt =>
      opt
        .setName('item')
        .setDescription('Name of the craftable item')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt
        .setName('quantity')
        .setDescription('How many to order')
        .setRequired(true)
    ),

  async execute(interaction) {
    // 1️⃣ Read inputs
    const item = interaction.options.getString('item');
    const qty  = interaction.options.getInteger('quantity');

    // 2️⃣ Generate a unique order ID
    const orderId = uuidv4();

    // 3️⃣ Insert into the database
    try {
      await run(
        `INSERT INTO orders (id, userId, item, quantity, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        orderId,
        interaction.user.id,
        item,
        qty
      );
    } catch (err) {
      console.error('DB insert error:', err);
      return interaction.reply({
        content: '❌ There was an error placing your order. Please try again later.',
         // ephemeral: true
      });
    }

    // Confirm order has been placed
    await interaction.reply({
      content: `✅ Order \`${orderId}\` placed: **${qty}×${item}**`,
      ephemeral: true
    });

    // Notify the “craft-orders” channel publicly
    const craftChannel = interaction.guild.channels.cache.find(
      ch => ch.isTextBased() && ch.name === 'craft-orders'
    );
    if (craftChannel) {
      await craftChannel.send(
        `📦 New order \`${orderId}\` from ${interaction.user.toString()}: **${qty}×${item}**`
      );
    }
  }
};