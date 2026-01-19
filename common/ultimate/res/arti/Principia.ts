import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Principia`,
  color: `blue`,
  age: 5,
  expansion: `arti`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return your top card of each non-blue color. For each card you return, draw and meld a card of value one higher than the value of the returned card, in ascending order.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toReturn = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'blue')

      const returned = game
        .actions
        .returnMany(player, toReturn)
        .sort((l, r) => l.getAge() - r.getAge())

      for (const card of returned) {
        game.actions.drawAndMeld(player, card.getAge() + 1)
      }

    }
  ],
} satisfies AgeCardData
