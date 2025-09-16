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
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })

      const blueCards = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.color === 'blue')
      if (blueCards.length > 0) {
        game.actions.chooseAndMeld(player, blueCards)
      }
      else {
        game.log.add({
          template: '{player} has no blue cards',
          args: { player }
        })
      }
      game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))
      game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'))
    }
  ],
}
