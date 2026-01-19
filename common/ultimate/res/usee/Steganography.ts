import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Steganography`,
  color: `purple`,
  age: 2,
  expansion: `usee`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `You may splay left a color on your board with {s}. If you do, safeguard an available achievement of value equal to the number of cards of that color on your board. Otherwise, draw and tuck a {3}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))
        .filter(zone => zone.biscuits().s > 0)
        .map(zone => zone.color)

      const splayed = game.actions.chooseAndSplay(player, choices, 'left')[0]

      if (splayed) {
        const numCards = game.cards.byPlayer(player, splayed).length
        game.actions.safeguardAvailableAchievement(player, numCards)
      }

      else {
        game.actions.drawAndTuck(player, game.getEffectAge(self, 3))
      }
    },
  ],
} satisfies AgeCardData
