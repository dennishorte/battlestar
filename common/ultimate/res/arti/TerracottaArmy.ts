import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Terracotta Army`,
  color: `yellow`,
  age: 2,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `I compel you to return a top card with no {k}!`,
    `Score a card from your hand with no {k}. If you do, junk all cards in the deck of value equal to the scored card. Otherwise, tuck Terracotta Army.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.tops(player)
        .filter(card => !card.checkHasBiscuit('k'))
      game.actions.chooseAndReturn(player, choices)
    },
    (game, player, { self }) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => !card.checkHasBiscuit('k'))
      const scored = game.actions.chooseAndScore(player, choices)[0]
      if (scored) {
        game.actions.junkDeck(player, scored.getAge())
      }

      else {
        game.actions.tuck(player, self)
      }
    }
  ],
} satisfies AgeCardData
