const util = require('../../../lib/util.js')

module.exports = {
  name: `Lever`,
  color: `blue`,
  age: 2,
  expansion: `echo`,
  biscuits: `sh&s`,
  dogmaBiscuit: `s`,
  echo: [`Draw two {2}.`],
  dogma: [
    `You may return any number of cards from your hand. For every two cards of matching value returned, draw a card of value one higher.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 999 })

      if (returned) {
        const toDraw = []
        const byAge = util.array.groupBy(returned, card => card.getAge())
        for (const [age, cards] of Object.entries(byAge)) {
          const count = Math.floor(cards.length / 2)
          for (let i = 0; i < count; i++) {
            toDraw.push(parseInt(age) + 1)
          }
        }

        toDraw.sort()

        while (toDraw.length > 0) {
          const age = game.actions.chooseAge(player, toDraw)
          game.actions.draw(player, { age })
          toDraw.splice(toDraw.indexOf(age), 1)
        }
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      game.actions.draw(player, { age: game.getEffectAge(this, 2) })
      game.actions.draw(player, { age: game.getEffectAge(this, 2) })
    }
  ],
}
