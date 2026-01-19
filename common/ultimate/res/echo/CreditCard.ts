import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Credit Card`,
  color: `green`,
  age: 9,
  expansion: `echo`,
  biscuits: `&c9h`,
  dogmaBiscuit: `c`,
  echo: `Draw and foreshadow a {9}.`,
  dogma: [
    `You may transfer a top non-green card from your board to your hand. If you do, draw and score a card of equal value. If you do, and Credit Card was foreseen, repeat this effect.`,
    `You may splay your green cards up.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      while (true) {
        const choices = game
          .cards.tops(player)
          .filter(card => card.color !== 'green')
        const card = game.actions.chooseCard(player, choices, {
          min: 0,
          max: 1,
          title: 'You may take a card into your hand.'
        })

        if (card) {
          game.actions.transfer(player, card, game.zones.byPlayer(player, 'hand'))
          game.actions.drawAndScore(player, card.getAge())

          game.log.addForeseen(foreseen, self)
          if (foreseen) {
            continue
          }

        }

        break
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'up')
    },
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndForeshadow(player, game.getEffectAge(self, 9))
  },
} satisfies AgeCardData
