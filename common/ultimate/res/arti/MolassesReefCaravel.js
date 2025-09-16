module.exports = {
  name: `Molasses Reef Caravel`,
  color: `green`,
  age: 4,
  expansion: `arti`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards from your hand. Draw three {4}. Meld a blue card from your hand. Score a card from your hand. Return a card from your score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })

      const blueCards = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === 'blue')
      if (blueCards.length > 0) {
        game.aChooseAndMeld(player, blueCards)
      }
      else {
        game.mLog({
          template: '{player} has no blue cards',
          args: { player }
        })
      }
      game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))
    }
  ],
}
