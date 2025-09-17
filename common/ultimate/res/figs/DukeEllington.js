module.exports = {
  id: `Duke Ellington`,  // Card names are unique in Innovation
  name: `Duke Ellington`,
  color: `purple`,
  age: 8,
  expansion: `figs`,
  biscuits: `s9*h`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `If you are required to fade a figure, instead do nothing.`,
    `If you would meld a figure and have four top figures already, instead achieve it regardless of eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'no-fade',
    },
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cardCondition = card.checkIsFigure()
        const topCondition = game
          .cards.tops(player)
          .filter(card => card.checkIsFigure())
          .length >= 4
        return cardCondition && topCondition
      },
      func: (game, player, { card }) => {
        game.actions.claimAchievement(player, { card })
      }
    }
  ]
}
