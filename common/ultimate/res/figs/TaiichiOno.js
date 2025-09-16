module.exports = {
  id: `Taiichi Ono`,  // Card names are unique in Innovation
  name: `Taiichi Ono`,
  color: `green`,
  age: 9,
  expansion: `figs`,
  biscuits: `hii&`,
  dogmaBiscuit: `i`,
  echo: `Draw a {0}.`,
  karma: [
    `If you would take a Dogma action and activate a card, first achieve a card from your hand with featured icon matching that card's featured icon, regardless of eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 10) })
  },
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const choices = game
          .getCardsByZone(player, 'hand')
          .filter(other => other.dogmaBiscuit === card.dogmaBiscuit)
        game.actions.chooseAndAchieve(player, choices)
      }
    }
  ]
}
