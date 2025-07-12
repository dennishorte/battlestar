module.exports = {
  name: `Spanish Inquisition`,
  color: `red`,
  age: 4,
  expansion: `usee`,
  biscuits: `shss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you return all but the highest cards from your hand and all but the highest cards from your score pile!`,
    `If Spanish Inquisition is a top card on your board, return all red cards from your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand')
      const handHighest = game.utilHighestCards(hand.cards())
      const handReturn = hand.cards().filter(c => !handHighest.includes(c))
      game.aReturnMany(player, handReturn)

      const score = game.zones.byPlayer(player, 'score')
      const scoreHighest = game.utilHighestCards(score.cards())
      const scoreReturn = score.cards().filter(c => !scoreHighest.includes(c))
      game.aReturnMany(player, scoreReturn)
    },
    (game, player) => {
      if (game.getTopCard(player, 'red').name === 'Spanish Inquisition') {
        const redCards = game.cards.byPlayer(player, 'red')
        game.aReturnMany(player, redCards, { ordered: true })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
