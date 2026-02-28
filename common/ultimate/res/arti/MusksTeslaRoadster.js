module.exports = {
  name: `Musk's Tesla Roadster`,
  color: `green`,
  age: 10,
  expansion: `arti`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `If you have the most cards in your score pile, you win. Otherwise, draw and reveal an {b}. Score all cards on your board of the color of the drawn card. If you do, return the drawn card. Otherwise, meld it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const playerCount = game.cards.byPlayer(player, 'score').length
      const otherCounts = game
        .players
        .opponents(player)
        .map(player => game.cards.byPlayer(player, 'score').length)
      const hasMost = otherCounts.every(count => count < playerCount)
      if (hasMost) {
        game.youWin(player, self.name)
      }
      else {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 11))
        const scored = game.actions.scoreMany(player, game.cards.byPlayer(player, card.color))
        if (scored.length > 0) {
          game.actions.return(player, card)
        }
        else {
          game.actions.meld(player, card)
        }
      }
    }
  ],
}
