const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Order of the Occult Hand`,
  color: `purple`,
  age: 10,
  expansion: `usee`,
  biscuits: `hfss`,
  dogmaBiscuit: `s`,
  dogma: [
    `If you have a {3} in your score pile, you lose.`,
    `If you have a {7} in your hand, you win.`,
    `Meld two cards from your hand. Score four cards from your hand. Splay your blue cards up.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hasAge3 = game
        .cards.byPlayer(player, 'score')
        .some(card => card.getAge() === 3)

      if (hasAge3) {
        game.aYouLose(player, self)
      }
    },
    (game, player, { self }) => {
      const hasAge7 = game
        .cards.byPlayer(player, 'hand')
        .some(card => card.getAge() === 7)

      if (hasAge7) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    },
    (game, player) => {
      game.aChooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { count: 2 })
      game.aChooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count: 4 })
      game.aSplay(player, 'blue', 'up')
    }
  ],
}
