const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Solar Sailing`,
  color: `blue`,
  age: 11,
  expansion: `base`,
  biscuits: `issh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld an {e}. If its color is not splayed aslant on your board, return all but your top four cards of that color, and splay that color aslant. If there are at least six cards of that color on your board, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 11))
      if (!card) {
        game.log.addNoEffect()
        return
      }

      const color = card.color
      const zone = game.zones.byPlayer(player, color)

      if (zone.splay !== 'aslant') {
        const cards = zone.cards()
        if (cards.length > 4) {
          const toReturn = cards.slice(4)
          game.actions.returnMany(player, toReturn, { ordered: true })
        }

        game.actions.splay(player, color, 'aslant')
      }

      // Check for win condition
      const colorCount = zone.cards().length
      if (colorCount >= 6) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    }
  ],
}
