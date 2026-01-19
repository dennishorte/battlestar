import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Specialization`,
  color: `purple`,
  age: 9,
  expansion: `base`,
  biscuits: `hflf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Reveal a card from your hand. Take into your hand the top card of that color from all opponents' boards.`,
    `You may splay your yellow or blue cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand')
      const card = game.actions.chooseCard(player, hand.cardlist())

      if (card) {
        game.actions.reveal(player, card)

        const stolen = game
          .players.opponents(player)
          .map(opponent => game.cards.top(opponent, card.color))
          .filter(card => card !== undefined)

        game.actions.transferMany(player, stolen, hand)
      }

    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow', 'blue'], 'up')
    },
  ],
} satisfies AgeCardData
