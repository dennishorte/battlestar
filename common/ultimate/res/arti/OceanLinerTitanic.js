module.exports = {
  name: `Ocean Liner Titanic`,
  color: `green`,
  age: 8,
  expansion: `arti`,
  biscuits: `cfch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score all bottom cards from your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toScore = []
      for (const color of game.util.colors()) {
        const cards = game.cards.byPlayer(player, color)
        if (cards.length > 0) {
          toScore.push(cards[cards.length - 1])
        }
      }

      game.actions.scoreMany(player, toScore)
    }
  ],
}
