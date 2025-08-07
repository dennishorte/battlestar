const util = require('../../../lib/util.js')

module.exports = {
  name: `Pantheism`,
  color: `purple`,
  age: 5,
  expansion: `usee`,
  biscuits: `hlss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Tuck a card from your hand. If you do, draw and tuck a {4}, score all cards on your board of the color of one of the tucked cards, and splay right the color on your board of the other tucked card.`,
    `Draw and tuck a {4}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const handCards = game.cards.byPlayer(player, 'hand')
      const firstCard = game.actions.chooseAndTuck(player, handCards)[0]

      if (firstCard) {
        const secondCard = game.actions.draw(player, { age: game.getEffectAge(self, 4) })
        game.actions.tuck(player, secondCard)

        const colorChoices = util.array.distinct([firstCard.color, secondCard.color])
        const colorToScore = game.actions.choose(player, colorChoices, {
          title: 'Choose a color to score',
        })[0]

        const cardsToScore = game.cards.byPlayer(player, colorToScore)
        game.actions.scoreMany(player, cardsToScore)

        const colorToSplay = colorToScore === firstCard.color ? secondCard.color : firstCard.color
        game.actions.splay(player, colorToSplay, 'right')
      }
    },
    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 4))
    }
  ],
}
