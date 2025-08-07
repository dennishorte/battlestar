const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Bioengineering`,
  color: `blue`,
  age: 10,
  expansion: `base`,
  biscuits: `siih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Score a top card with a {l} on any player's board.`,
    `If any player has fewer than two {l} on their board, the single player with the most {l} on their board wins.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .players.all()
        .flatMap(p => game.getTopCards(p))
        .filter(card => card !== undefined)
        .filter(card => card.biscuits.includes('l'))

      game.actions.chooseAndScore(player, choices)
    },

    (game) => {
      const biscuits = Object
        .entries(game.getBiscuits())
        .map(([player, biscuits]) => ({ player, leafs: biscuits.l }))
        .sort((l, r) => r.leafs - l.leafs)

      const conditionMet = (
        biscuits[biscuits.length - 1].leafs < 2
        && biscuits[0].leafs > biscuits[1].leafs
      )

      if (conditionMet) {
        throw new GameOverEvent({
          player: game.players.byName(biscuits[0].player),
          reason: 'Bioengineering',
        })
      }
      else if (biscuits[0].leafs === biscuits[1].leafs) {
        game.log.add({ template: 'there is a tie for fewest leafs' })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
