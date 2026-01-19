import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Fertilizer`,
  color: `yellow`,
  age: 7,
  expansion: `echo`,
  biscuits: `lhfl`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `You may return a card from your hand. If you do, transfer all cards from all score piles to your hand of value equal to the returned card.`,
    `Draw and foreshadow a card of value equal to the number of cards in your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1} )
      if (cards && cards.length > 0) {
        const age = cards[0].getAge()
        const toTransfer = game
          .players.all()
          .flatMap(player => game
            .cards.byPlayer(player, 'score')
            .filter(card => card.getAge() === age)
          )
        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'hand'))
      }

    },

    (game, player) => {
      const age = game.cards.byPlayer(player, 'hand').length
      game.actions.drawAndForeshadow(player, age)
    }
  ],
  echoImpl: [],
} satisfies AgeCardData
