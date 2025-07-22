const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Empiricism`,
  color: `purple`,
  age: 8,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose two colors, then draw and reveal a {9}. If the drawn card is one of those colors, meld it and splay your cards of that color up, otherwise unsplay that color.`,
    `If you have at least twenty {s} on your board, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const colors = game.actions.choose(player, game.utilColors(), { count: 2, title: 'Choose Two Colors' })
      game.log.add({
        template: '{player} chooses {color1} and {color2}',
        args: {
          player,
          color1: colors[0],
          color2: colors[1],
        }
      })

      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 9))
      if (colors.includes(card.color)) {
        game.actions.meld(player, card)
        game.aSplay(player, card.color, 'up')
      }
      else {
        game.aUnsplay(player, card.color)
      }
    },

    (game, player, { self }) => {
      const biscuits = game.getBiscuitsByPlayer(player)
      if (biscuits.s >= 20) {
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
