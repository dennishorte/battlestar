module.exports = {
  id: "grain-thief-e112",
  name: "Grain Thief",
  deck: "occupationE",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you would harvest a grain field, you can leave the grain on the field and take 1 grain from the general supply instead.",
  onWouldHarvestGrainField(game, player, field) {
    const loc = field.label || `${field.row},${field.col}`
    const choices = [
      game.actions.option({ id: 'use', title: 'Use Grain Thief' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ]
    const selection = game.actions.choose(player, choices, {
      title: `Grain Thief: Leave grain on field (${loc}) and take 1 from supply?`,
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'use') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} uses {card} to leave grain on field and take 1 from supply',
        args: { player, card: this },
      })
      return true
    }
  },
}
