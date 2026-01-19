import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Baghdad Battery`,
  color: `green`,
  age: 2,
  expansion: `arti`,
  biscuits: `cshc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld a card from your hand. Score a card from your hand. If you do both, and the cards have different values, junk all cards in the decks of both values.`
  ],
  dogmaImpl: [
    (game, player) => {
      const melded = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))[0]
      const scored = game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))[0]

      if (melded && scored && melded.getAge() !== scored.getAge()) {
        game.actions.junkDeck(player, melded.getAge())
        game.actions.junkDeck(player, scored.getAge())
      }

    },
  ],
} satisfies AgeCardData
