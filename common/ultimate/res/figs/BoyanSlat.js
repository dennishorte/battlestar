module.exports = {
  id: `Boyan Slat`,  // Card names are unique in Innovation
  name: `Boyan Slat`,
  color: `green`,
  age: 11,
  expansion: `figs`,
  biscuits: `shps`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would draw a card, first choose a value and return all cards of that value from all score piles. If you return exactly one card, achieve it, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const value = game.actions.chooseAge(player, game.getAges())
        const toReturn = game
          .players
          .all()
          .flatMap(p => game.cards.byPlayer(p, 'score'))
          .filter(card => card.getAge() === value)

        const returned = game.actions.returnMany(player, toReturn)

        if (returned.length === 1) {
          game.actions.claimAchievement(player, returned[0])
        }
      }
    }
  ]
}
