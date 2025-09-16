const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Gene Roddenberry`,  // Card names are unique in Innovation
  name: `Gene Roddenberry`,
  color: `purple`,
  age: 9,
  expansion: `figs`,
  biscuits: `ch&9`,
  dogmaBiscuit: `c`,
  echo: `Meld a top purple card from anywhere.`,
  karma: [
    `If you would meld a purple card, instead if it is Enterprise, you win. Otherwise, instead tuck the card and return any top figure.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const purples = game
      .getPlayerAll()
      .map(player => game.getTopCard(player, 'purple'))
      .filter(card => card !== undefined)
    game.aChooseAndMeld(player, purples)
  },
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        return card.color === 'purple'
      },
      func: (game, player, { card }) => {
        if (card.name === 'Enterprise') {
          throw new GameOverEvent({
            player,
            reason: this.name,
          })
        }
        else {
          game.aTuck(player, card)
          const topFigures = game
            .getPlayerAll()
            .flatMap(player => game.getTopCards(player))
            .filter(card => card.checkIsFigure())
          game.aChooseAndReturn(player, topFigures)
        }
      }
    }
  ]
}
