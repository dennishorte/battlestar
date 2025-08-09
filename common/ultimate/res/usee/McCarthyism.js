module.exports = {
  name: `McCarthyism`,
  color: `red`,
  age: 9,
  expansion: `usee`,
  biscuits: `fiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you draw and meld an {8}! If Socialism is a top card on your board, you lose!`,
    `Score your top purple card.`,
    `You may splay your red or blue cards up.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 8))

      const socialism = game
        .cards.tops(player)
        .find(card => card.name === 'Socialism')

      if (socialism) {
        game.log.add({
          template: '{player} has Socialism on their board and loses the game!',
          args: { player }
        })
        game.aYouLose(player, self)
      }
    },

    (game, player) => {
      const purple = game.getTopCard(player, 'purple')
      if (purple) {
        game.actions.score(player, purple)
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'blue'], 'up')
    }
  ],
}
