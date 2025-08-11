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
    (game, player, { leader }) => {
      const valid = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('k') || card.checkHasBiscuit('s'))

      const transferred = game.actions.chooseAndTransfer(
        player,
        valid,
        game.zones.byPlayer(leader, 'hand')
      )
      if (transferred && transferred.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(this, 1) })
      }
    }
  ],
  echoImpl: (game, player) => {
    const playerScore = game.getScore(player)
    const otherScores = game
      .getPlayerAll()
      .filter(other => other !== player)
      .map(other => game.getScore(other))

    const isLowest = otherScores.every(score => score >= playerScore)
    if (isLowest) {
      game.aDraw(player, { age: game.getEffectAge(this, 3) })
    }
  },
}
