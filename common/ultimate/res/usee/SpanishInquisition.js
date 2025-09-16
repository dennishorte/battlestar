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
      const handHighest = game.util.highestCards(hand.cardlist())
      const handReturn = hand.cardlist().filter(c => !handHighest.includes(c))
      game.actions.returnMany(player, handReturn)

      const score = game.zones.byPlayer(player, 'score')
      const scoreHighest = game.util.highestCards(score.cardlist())
      const scoreReturn = score.cardlist().filter(c => !scoreHighest.includes(c))
      game.actions.returnMany(player, scoreReturn)
    },
    (game, player) => {
      if (game.cards.top(player, 'red').name === 'Spanish Inquisition') {
        const redCards = game.cards.byPlayer(player, 'red')
        game.actions.returnMany(player, redCards, { ordered: true })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
