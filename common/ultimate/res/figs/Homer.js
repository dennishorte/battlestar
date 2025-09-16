module.exports = {
  id: `Homer`,  // Card names are unique in Innovation
  name: `Homer`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `h*2k`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `If you would remove or return a figure from your hand, instead tuck it.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: ['remove', 'return'],
      kind: 'would-instead',
      matches(game, player, { card }) {
        const regex = /players[.].+[.]hand/
        return card.checkIsFigure() && card.zone.match(regex)
      },
      func(game, player, { card }) {
        return game.aTuck(player, card)
      }
    }
  ]
}
