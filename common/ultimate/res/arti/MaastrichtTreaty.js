
module.exports = {
  name: `Maastricht Treaty`,
  color: `green`,
  age: 10,
  expansion: `arti`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `If you have the most cards in your score pile, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const playerCount = game.cards.byPlayer(player, 'score').length
      const otherCounts = game
        .players.opponents(player)
        .map(player => game.cards.byPlayer(player, 'score').length)
      const hasMost = otherCounts.every(count => count < playerCount)
      if (hasMost) {
        game.youWin(player, self.name)
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
