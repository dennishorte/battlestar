const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Astrogeology`,
  color: `red`,
  age: 11,
  expansion: `base`,
  biscuits: `chff`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and reveal an {e}. Splay its color on your board aslant. If you do, transfer all but your top four cards of that color to your hand.`,
    `If you have at least eight cards in your hand, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(self, 11))
      if (card) {
        const color = card.color
        const splayed = Boolean(game.aSplay(player, color, 'aslant'))

        if (splayed) {
          const cards = game.getCardsByZone(player, color)
          if (cards.length > 4) {
            const toReturn = cards.slice(4)
            game.aTransferMany(player, toReturn, game.getZoneByPlayer(player, 'hand'), { ordered: true })
          }
        }
      }
    },

    (game, player, { self }) => {
      const handSize = game.getZoneByPlayer(player, 'hand').cards().length
      if (handSize >= 8) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
