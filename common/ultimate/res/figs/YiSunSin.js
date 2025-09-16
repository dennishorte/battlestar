module.exports = {
  id: `Yi Sun-Sin`,  // Card names are unique in Innovation
  name: `Yi Sun-Sin`,
  color: `red`,
  age: 4,
  expansion: `figs`,
  biscuits: `4hf&`,
  dogmaBiscuit: `f`,
  echo: `Score a top card with a {k} from anywhere.`,
  karma: [
    `If you would score a card of a color you have splayed, instead tuck it, then draw a {3}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getTopCardsAll()
      .filter(card => card.checkHasBiscuit('k'))
    game.aChooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches(game, player, { card }) {
        const zone = game.getZoneByPlayer(player, card.color)
        return zone.splay !== 'none'
      },
      func: (game, player, { card }) => {
        game.aTuck(player, card)
        game.aDraw(player, { age: game.getEffectAge(this, 3) })
      }
    }
  ]
}
