module.exports = {
  id: `Ruth Handler`,  // Card names are unique in Innovation
  name: `Ruth Handler`,
  color: `yellow`,
  age: 9,
  expansion: `figs`,
  biscuits: `9phf`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would meld a card, first meld all other cards of that color from each player's hand, then draw and achieve a {9} for each card you meld in this way, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, self }) => {
        const toMeld = game
          .players
          .all()
          .flatMap(player2 => game.cards.byPlayer(player2, 'hand'))
          .filter(other => other.color === card.color)
          .filter(other => other.id !== card.id)

        const melded = game.actions.meldMany(player, toMeld)

        for (let i = 0; i < melded.length; i++) {
          const toAchieve = game.actions.draw(player, { age: game.getEffectAge(self, 9) })
          game.actions.claimAchievement(player, toAchieve)
        }
      }
    }
  ]
}
