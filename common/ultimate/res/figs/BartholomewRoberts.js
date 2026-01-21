module.exports = {
  id: `Bartholomew Roberts`,  // Card names are unique in Innovation
  name: `Bartholomew Roberts`,
  color: `green`,
  age: 5,
  expansion: `figs`,
  biscuits: `phc6`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would take a Draw action, instead score a top card with a {c} from anywhere.`,
    `If you would draw a card, first claim an available achievement matching that card's value, regardless of eligibility.`,
  ],
  karmaImpl: [
    {
      trigger: 'draw-action',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player) => {
        const canScore = game
          .cards
          .topsAll()
          .filter(card => card.checkHasBiscuit('c'))
        game.actions.chooseAndScore(player, canScore)
      },
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { age }) => {
        const canAchieve = player
          .availableStandardAchievements()
          .filter(card => card.getAge() === age)
        game.actions.chooseAndAchieve(player, canAchieve, { nonAction: true })
      }
    }
  ]
}
