module.exports = {
  id: "hardware-store-c082",
  name: "Hardware Store",
  deck: "minorC",
  number: 82,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  category: "Building Resource Provider",
  text: "Each time after you use the \"Day Laborer\" action space, you can pay 2 food total to buy 1 wood, 1 clay, 1 reed, and 1 stone.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer' && player.food >= 2) {
      const selection = game.actions.choose(player, [
        'Pay 2 food for 1 wood, 1 clay, 1 reed, and 1 stone',
        'Skip',
      ], {
        title: 'Hardware Store',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 2 })
        player.addResource('wood', 1)
        player.addResource('clay', 1)
        player.addResource('reed', 1)
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} buys building materials using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
