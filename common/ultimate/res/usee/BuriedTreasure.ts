export default {
  name: `Buried Treasure`,
  color: `green`,
  age: 5,
  expansion: `usee`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose an odd value. Transfer all cards of that value from all score piles to the available achievements. If you transfer at least four cards, draw and safeguard a card of that value, and score three available standard achievements.`
  ],
  dogmaImpl: [
    (game, player) => {
      const oddValues = game.getAges().filter(x => x % 2 === 1)
      const value = game.actions.chooseAge(player, oddValues)

      const toTransfer = game
        .players.all()
        .flatMap(p => game.cards.byPlayer(p, 'score'))
        .filter(card => card.getAge() === value)

      const transferred = game.actions.transferMany(player, toTransfer, game.zones.byId('achievements'))

      if (transferred.length >= 4) {
        game.actions.drawAndSafeguard(player, value)

        const availableStandard = game.getAvailableStandardAchievements(player)
        game.actions.chooseAndScore(player, availableStandard, { count: 3, hidden: true })
      }
    },
  ],
}
