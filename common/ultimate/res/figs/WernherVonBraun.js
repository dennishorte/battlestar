module.exports = {
  id: `Wernher Von Braun`,  // Card names are unique in Innovation
  name: `Wernher Von Braun`,
  color: `blue`,
  age: 9,
  expansion: `figs`,
  biscuits: `*ssh`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `Each card in your forecast counts as being in your score pile.`
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
          ...game.zones.byPlayer(player, 'forecast')._cards,
        ]
      }
    }
  ]
}
