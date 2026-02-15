module.exports = {
  id: "animal-feeder-c138",
  name: "Animal Feeder",
  deck: "occupationC",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "On the \"Day Laborer\" action space, you also get your choice of 1 sheep or 1 grain. Instead of that good, you can buy 1 wild boar for 1 food or 1 cattle for 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const choices = ['1 sheep', '1 grain']
      if (player.food >= 1) {
        choices.push('Pay 1 food for 1 wild boar')
      }
      if (player.food >= 2) {
        choices.push('Pay 2 food for 1 cattle')
      }
      const selection = game.actions.choose(player, () => choices, { title: 'Animal Feeder', min: 1, max: 1 })
      if (selection[0] === '1 sheep') {
        player.addAnimals('sheep', 1)
        game.log.add({ template: '{player} gets 1 sheep from Animal Feeder', args: { player } })
      }
      else if (selection[0] === '1 grain') {
        player.addResource('grain', 1)
        game.log.add({ template: '{player} gets 1 grain from Animal Feeder', args: { player } })
      }
      else if (selection[0] === 'Pay 1 food for 1 wild boar') {
        player.payCost({ food: 1 })
        player.addAnimals('boar', 1)
        game.log.add({ template: '{player} buys 1 wild boar from Animal Feeder', args: { player } })
      }
      else if (selection[0] === 'Pay 2 food for 1 cattle') {
        player.payCost({ food: 2 })
        player.addAnimals('cattle', 1)
        game.log.add({ template: '{player} buys 1 cattle from Animal Feeder', args: { player } })
      }
    }
  },
}
