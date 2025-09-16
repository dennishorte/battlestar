module.exports = {
  id: `Sinuhe`,  // Card names are unique in Innovation
  name: `Sinuhe`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `&llh`,
  dogmaBiscuit: `l`,
  echo: `Draw and foreshadow a {2} or {3}.`,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {k} on your board provides one additional point towards your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [
    (game, player) => {
      const age = game.actions.chooseAge(player, [game.getEffectAge(this, 2), game.getEffectAge(this, 3)])
      game.aDrawAndForeshadow(player, age)
    }
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func(game, player) {
        const biscuits = game.getBiscuitsByPlayer(player)
        return biscuits.k
      }
    }
  ]
}
