import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Railroad`,
  color: `purple`,
  age: 7,
  expansion: `base`,
  biscuits: `ifih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Return all cards from your hand`,
    `Draw three {6}.`,
    `You may splay up any one color of your cards current splayed right.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
    },

    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 6) })
      game.actions.draw(player, { age: game.getEffectAge(self, 6) })
      game.actions.draw(player, { age: game.getEffectAge(self, 6) })
    },

    (game, player) => {
      const choices = game
        .util.colors()
        .filter(color => game.zones.byPlayer(player, color).splay === 'right')
      game.actions.chooseAndSplay(player, choices, 'up')
    }

  ],
} satisfies AgeCardData
