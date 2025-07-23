module.exports = {
  name: `Tools`,
  color: `blue`,
  age: 1,
  expansion: `base`,
  biscuits: `hssk`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return three cards from your hand. If you do, draw and meld a {3}.`,
    `You may return a {3} from your hand. If you do, draw three {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.cards.byPlayer(player, 'hand')
      if (cards.length >= 3) {
        const doIt = game.actions.chooseYesNo(player, 'Return three cards to draw and meld a {3}?')
        if (doIt) {
          const returned = game.actions.chooseAndReturn(player, cards, { count: 3 })
          if (returned.length === 3) {
            game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
          }
        }
        else {
          game.log.addDoNothing(player)
        }
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player, { self }) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.getAge() === 3)
      const returned = game.actions.chooseAndReturn(player, choices, { min: 0, max: 1 })
      if (returned && returned.length > 0) {
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      }
    }
  ],
}
