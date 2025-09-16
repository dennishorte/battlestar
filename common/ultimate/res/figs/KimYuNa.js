const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Kim Yu-Na`,  // Card names are unique in Innovation
  name: `Kim Yu-Na`,
  color: `purple`,
  age: 10,
  expansion: `figs`,
  biscuits: `hl&a`,
  dogmaBiscuit: `l`,
  echo: `Score a top card from your board.`,
  karma: [
    `If you would score a card with a {k}, instead you win.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aChooseAndScore(player, game.getTopCards(player))
  },
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, func, { card }) => card.biscuits.includes('k'),
      func: (game, player) => {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
    }
  ]
}
