module.exports = {
  id: `Michaelangelo`,  // Card names are unique in Innovation
  name: `Michaelangelo`,
  color: `yellow`,
  age: 4,
  expansion: `figs`,
  biscuits: `ch*c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `Each card in your hand is also considered part of your score pile.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'list-score',
      func(game, player) {
        return [
          ...game.zones.byPlayer(player, 'score')._cards,
          ...game.zones.byPlayer(player, 'hand')._cards,
        ]
      }
    }
  ]
}
