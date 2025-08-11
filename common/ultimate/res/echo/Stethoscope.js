module.exports = {
  name: `Stethoscope`,
  color: `blue`,
  age: 6,
  expansion: `echo`,
  biscuits: `s&sh`,
  dogmaBiscuit: `s`,
  echo: `Meld a blue or yellow card from your hand.`,
  dogma: [
    `Draw a {7}. If you melded a blue card due to Stethoscope's echo effect, draw an {8}.`,
    `You may splay your yellow cards right.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.draw(player, { age: game.getEffectAge(this, 7) })

      if (game.state.dogmaInfo.stethoscope) {
        const melded = game.state.dogmaInfo.stethoscope[player.name]
        if (melded && melded.some(card => card.color === 'blue')) {
          game.actions.draw(player, { age: game.getEffectAge(this, 8) })
        }
      }
      else {
        game.log.add({ template: 'No card melded due to echo effect' })
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'right')
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .cards.byPlayer(player, 'hand')
      .filter(card => card.color === 'yellow' || card.color === 'blue')
    const melded = game.actions.chooseAndMeld(player, choices)

    if (!game.state.dogmaInfo.stethoscope) {
      game.state.dogmaInfo.stethoscope = {}
    }
    if (!game.state.dogmaInfo.stethoscope[player.name]) {
      game.state.dogmaInfo.stethoscope[player.name] = []
    }

    melded.forEach(card => {
      game.state.dogmaInfo.stethoscope[player.name].push(card)
    })
  },
}
