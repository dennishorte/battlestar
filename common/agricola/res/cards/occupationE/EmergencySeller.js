module.exports = {
  id: "emergency-seller-e106",
  name: "Emergency Seller",
  deck: "occupationE",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately turn as many building resources into food as you have people: Each wood or clay is worth 2 food; each reed or stone is worth 3 food.",
  onPlay(game, player) {
    const maxConversions = player.getFamilySize()
    let remaining = maxConversions

    while (remaining > 0) {
      const choices = []
      if (player.wood > 0) {
        choices.push('Sell 1 wood (2 food)')
      }
      if (player.clay > 0) {
        choices.push('Sell 1 clay (2 food)')
      }
      if (player.reed > 0) {
        choices.push('Sell 1 reed (3 food)')
      }
      if (player.stone > 0) {
        choices.push('Sell 1 stone (3 food)')
      }
      if (choices.length === 0) {
        break
      }
      choices.push('Done')

      const selection = game.actions.choose(player, choices, {
        title: `Emergency Seller: Convert building resources to food (${remaining} left)`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Done') {
        break
      }

      const choice = selection[0]
      if (choice.includes('wood')) {
        player.removeResource('wood', 1)
        player.addResource('food', 2)
        game.log.add({ template: '{player} sells 1 wood for 2 food (Emergency Seller)', args: { player } })
      }
      else if (choice.includes('clay')) {
        player.removeResource('clay', 1)
        player.addResource('food', 2)
        game.log.add({ template: '{player} sells 1 clay for 2 food (Emergency Seller)', args: { player } })
      }
      else if (choice.includes('reed')) {
        player.removeResource('reed', 1)
        player.addResource('food', 3)
        game.log.add({ template: '{player} sells 1 reed for 3 food (Emergency Seller)', args: { player } })
      }
      else if (choice.includes('stone')) {
        player.removeResource('stone', 1)
        player.addResource('food', 3)
        game.log.add({ template: '{player} sells 1 stone for 3 food (Emergency Seller)', args: { player } })
      }
      remaining--
    }
  },
}
