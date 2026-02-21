module.exports = {
  id: "canal-boatman-d103",
  name: "Canal Boatman",
  deck: "occupationD",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "Each time you use \"Fishing\" or \"Reed Bank\", you can pay 1 food to immediately place another person on this card. If you do, you get your choice of 3 stone or 1 grain plus 1 vegetable.",
  onAction(game, player, actionId) {
    if (actionId !== 'fishing' && actionId !== 'take-reed') {
      return
    }
    if (player.food < 1 || player.getAvailableWorkers() < 1) {
      return
    }
    const choices = ['Get 3 stone (pay 1 food + 1 worker)', 'Get 1 grain + 1 vegetable (pay 1 food + 1 worker)', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Canal Boatman',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    player.removeResource('food', 1)
    player.availableWorkers -= 1
    if (selection[0].startsWith('Get 3 stone')) {
      player.addResource('stone', 3)
      game.log.add({
        template: '{player} places a worker on {card} for 3 stone',
        args: { player , card: this},
      })
    }
    else {
      player.addResource('grain', 1)
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} places a worker on {card} for 1 grain + 1 vegetable',
        args: { player , card: this},
      })
    }
  },
}
