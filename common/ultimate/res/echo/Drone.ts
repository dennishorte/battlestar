import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Drone`,
  color: `red`,
  age: 11,
  expansion: `echo`,
  biscuits: `liih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and reveal an {b}. If you have fewer than six cards of its color on your board, splay that color aslant. Otherwise, return the bottom five cards of that color from all boards. If you do, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 11))

        const count = game.zones.byPlayer(player, card.color).numVisibleCards()
        game.log.add({
          template: '{player} has {count} visible {color} cards',
          args: { player, count, color: card.color }

        })

        if (count < 6) {
          game.actions.splay(player, card.color, 'aslant')
          break
        }
        else {
          const toReturn = game
            .players
            .all()
            .flatMap(p => game.cards.byPlayer(p, card.color).slice(-5))
          game.actions.returnMany(player, toReturn)
          continue
        }
      }
    }
  ],
} satisfies AgeCardData
