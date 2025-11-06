module.exports = {
  id: `Johannes Kepler`,  // Card names are unique in Innovation
  name: `Johannes Kepler`,
  color: `blue`,
  age: 4,
  expansion: `figs`,
  biscuits: `hs&s`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would take a Dogma action, first reveal all cards of the chosen card's color from your hand. Increase each {} value in any effect during this action by the number of cards you revealed.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const matchingCards = game
          .cards.byPlayer(player, 'hand')
          .filter(other => other.color === card.color)

        matchingCards.forEach(card => game.mReveal(player, card))
        game.state.dogmaInfo.globalAgeIncrease = matchingCards.length
        game.log.add({
          template: 'All {} values increased by {value} during this dogma action',
          args: {
            value: matchingCards.length
          }
        })
      }
    }
  ]
}
