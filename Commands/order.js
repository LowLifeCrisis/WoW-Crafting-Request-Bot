module.exports = {
    data: {
      name: 'order',
      description: 'Place a crafting order',
      options: [
        {
          name: 'item',
          type: 3, // STRING
          description: 'Name of the craftable item',
          required: true
        },
        {
          name: 'quantity',
          type: 4, // INTEGER
          description: 'How many to order',
          required: true
        }
      ]
    },
    async execute(interaction) {
      const item = interaction.options.getString('item');
      const qty  = interaction.options.getInteger('quantity');
      // Place holder for DB Logic
      await interaction.reply(`✅ Order received: ${qty}×${item}. Our finest sweatshop workers are on it.`);
    }
  };
  