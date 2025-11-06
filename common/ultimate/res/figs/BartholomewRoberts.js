module.exports = {
  id: `Bartholomew Roberts`,  // Card names are unique in Innovation
  name: `Bartholomew Roberts`,
  color: `green`,
  age: 5,
  expansion: `figs`,
  biscuits: `*hc6`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would score a card, first claim an achievement matching that card's value, ignoring the age requirement.`
  ],
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const eligible = game
          .getEligibleAchievementsRaw(player, { ignoreAge: true })
          .filter(other => card.getAge() === other.getAge())

        game.actions.chooseAndAchieve(player, eligible, { nonAction: true })
      }
    }
  ]
}
