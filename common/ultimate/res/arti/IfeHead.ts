import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Ife Head`,
  color: `green`,
  age: 3,
  expansion: `arti`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Splay right an unsplayed color on your board. Junk an available achievement of value equal to the number of cards of that color on your board. If you don't, draw a card of that value.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .util
        .colors()
        .filter(color => {
          const zone = game.zones.byPlayer(player, color)
          return zone.cardlist().length > 1 && zone.splay !== 'right'
        })

      const color = game.actions.choose(player, choices, {
        title: 'Choose a color to splay right',
        count: 1,
      })

      if (color) {
        game.actions.splay(player, color, 'right')
        const count = game.cards.byPlayer(player, color).length
        const junked = game.actions.junkAvailableAchievement(player, count)

        if (!junked) {
          game.actions.draw(player, { age: count })
        }

      }
    }
  ],
} satisfies AgeCardData
