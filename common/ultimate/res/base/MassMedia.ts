import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Mass Media`,
  color: `green`,
  age: 8,
  expansion: `base`,
  biscuits: `shis`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return a card from your hand. If you do, choose a value and return all cards of that value from all score piles.`,
    `You may splay your purple cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const age = game.actions.chooseAge(player)
        game.log.add({
          template: '{player} chooses age {age}',
          args: { player, age }

        })
        game.log.indent()
        const toReturn = game
          .players.all()
          .flatMap(player => game.cards.byPlayer(player, 'score'))
          .filter(card => card.getAge() === age)
        game.actions.returnMany(player, toReturn)
        game.log.outdent()
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'up')
    },
  ],
} satisfies AgeCardData
