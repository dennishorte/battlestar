export default {
  name: `Greenland`,
  color: `green`,
  age: 11,
  expansion: `arti`,
  biscuits: `lihl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to return one of your top cards with {i}. If you do, repeat this effect.`,
    `Return on of your top cards with {c}. If you do, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const choices = game.cards.tops(player).filter(card => card.checkHasBiscuit('i'))
        const returned = game.actions.chooseAndReturn(player, choices)[0]

        if (returned) {
          continue
        }
        else {
          break
        }
      }
    },

    (game, player) => {
      while (true) {
        const choices = game.cards.tops(player).filter(card => card.checkHasBiscuit('c'))
        const returned = game.actions.chooseAndReturn(player, choices)[0]

        if (returned) {
          continue
        }
        else {
          break
        }
      }
    },
  ],
}
