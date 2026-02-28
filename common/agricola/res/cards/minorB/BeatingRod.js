module.exports = {
  id: "beating-rod-b009",
  name: "Beating Rod",
  deck: "minorB",
  number: 9,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "You can immediately choose to either get 1 reed or exchange 1 reed for 1 cattle.",
  onPlay(game, player) {
    const card = this
    const choices = ['Get 1 reed']
    if (player.reed >= 1) {
      choices.push('Exchange 1 reed for 1 cattle')
    }

    const selection = game.actions.choose(player, choices, {
      title: 'Beating Rod',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Get 1 reed') {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from {card}',
        args: { player, card },
      })
    }
    else {
      player.payCost({ reed: 1 })
      game.actions.handleAnimalPlacement(player, { cattle: 1 })
      game.log.add({
        template: '{player} exchanges 1 reed for 1 cattle from {card}',
        args: { player, card },
      })
    }
  },
}
