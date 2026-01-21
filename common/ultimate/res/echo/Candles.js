module.exports = {
  name: `Candles`,
  color: `red`,
  age: 1,
  expansion: `echo`,
  biscuits: `&1hs`,
  dogmaBiscuit: `s`,
  echo: `If no player has fewer points than you, draw a {3}.`,
  dogma: [
    `I demand you transfer a card with {k} or {s} from your hand to my hand! If you do, draw a {1}!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const valid = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('k') || card.checkHasBiscuit('s'))

      const transferred = game.actions.chooseAndTransfer(
        player,
        valid,
        game.zones.byPlayer(leader, 'hand')
      )
      if (transferred && transferred.length > 0) {
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    const playerScore = player.score()
    const otherScores = game
      .players.all()
      .filter(other => other !== player)
      .map(other => other.score())

    const isLowest = otherScores.every(score => score >= playerScore)
    if (isLowest) {
      game.actions.draw(player, { age: game.getEffectAge(self, 3) })
    }
  },
}
