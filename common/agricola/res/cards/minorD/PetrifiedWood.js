module.exports = {
  id: "petrified-wood-d006",
  name: "Petrified Wood",
  deck: "minorD",
  number: 6,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  category: "Building Resource Provider",
  text: "Immediately exchange up to 3 wood for 1 stone each.",
  onPlay(game, player) {
    const maxExchange = Math.min(3, player.wood || 0)
    if (maxExchange === 0) {
      game.log.add({
        template: '{player} has no wood to exchange (Petrified Wood)',
        args: { player },
      })
      return
    }

    const choices = []
    for (let i = 1; i <= maxExchange; i++) {
      choices.push(`Exchange ${i} wood for ${i} stone`)
    }
    choices.push('Do not exchange')

    const selection = game.actions.choose(player, choices, {
      title: 'Petrified Wood',
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Do not exchange') {
      const amount = parseInt(selection[0].split(' ')[1])
      player.removeResource('wood', amount)
      player.addResource('stone', amount)
      game.log.add({
        template: '{player} exchanges {amount} wood for {amount} stone (Petrified Wood)',
        args: { player, amount },
      })
    }
  },
}
