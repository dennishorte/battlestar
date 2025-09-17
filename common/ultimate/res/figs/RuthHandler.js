module.exports = {
  id: `Ruth Handler`,  // Card names are unique in Innovation
  name: `Ruth Handler`,
  color: `yellow`,
  age: 9,
  expansion: `figs`,
  biscuits: `9*hf`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `If you would meld a card, first meld all other cards of that color from your hand, then draw and achieve a {9} for each card you melded in this way, regardless of eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const toMeld = game
          .cards.byPlayer(player, 'hand')
          .filter(other => other.color === card.color)
          .filter(other => other !== card)
        const melded = game.actions.meldMany(player, toMeld)
        for (let i = 0; i < melded.length; i++) {
          const toAchieve = game.actions.draw(player, { age: game.getEffectAge(this, 9) })
          game.actions.claimAchievement(player, toAchieve)
        }
      }
    }
  ]
}
