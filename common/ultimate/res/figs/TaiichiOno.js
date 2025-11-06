module.exports = {
  id: `Taiichi Ono`,  // Card names are unique in Innovation
  name: `Taiichi Ono`,
  color: `green`,
  age: 9,
  expansion: `figs`,
  biscuits: `hii&`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would take a Dogma action and activate a card, first achieve a card from your hand with featured icon matching that card's featured icon, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const choices = game
          .cards.byPlayer(player, 'hand')
          .filter(other => other.dogmaBiscuit === card.dogmaBiscuit)
        game.actions.chooseAndAchieve(player, choices)
      }
    }
  ]
}
