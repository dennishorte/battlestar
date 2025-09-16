module.exports = {
  id: `Daedalus`,  // Card names are unique in Innovation
  name: `Daedalus`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `&hkk`,
  dogmaBiscuit: `k`,
  echo: `Draw and foreshadow a {4}.`,
  karma: [
    `Each card in your forecast adds one to the value of your highest top card for the purpose of claiming achievements.`,
    `Each achievement adds its value to your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 4))
  },
  karmaImpl: [
    {
      trigger: 'calculate-eligibility',
      reason: 'achieve',
      func(game, player) {
        return game.getCardsByZone(player, 'forecast').length
      },
    },
    {
      trigger: 'calculate-score',
      func(game, player) {
        return game
          .getCardsByZone(player, 'achievements')
          .filter(card => card.getAge() !== undefined)
          .reduce((l, r) => l + r.getAge(), 0)
      }
    }
  ]
}
