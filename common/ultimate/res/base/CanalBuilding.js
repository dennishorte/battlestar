module.exports = {
  name: `Canal Building`,
  color: `yellow`,
  age: 2,
  expansion: `base`,
  biscuits: `hclc`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may choose to exchange all the highest cards in your hand with all the highest cards in your score pile, or junk all cards in the {3} deck.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = [
        game.actions.option({ id: 'exchange', title: 'Exchange highest cards between hand and score pile' }),
        game.actions.option({ id: 'junk', title: 'Junk all cards in the 3 deck' }),
      ]
      const pick = game.actions.choose(player, choices, { title: "Choose one" })[0]
      const decision = (pick && typeof pick === 'object') ? pick.id : pick

      if (decision === 'exchange' || decision === 'Exchange highest cards between hand and score pile') {
        game.log.add({
          template: '{player} exchanges the highest cards in their hand and score pile',
          args: { player }
        })
        const hand = game.zones.byPlayer(player, 'hand')
        const score = game.zones.byPlayer(player, 'score')
        const handHighest = game.util.highestCards(hand.cardlist())
        const scoreHighest = game.util.highestCards(score.cardlist())

        game.actions.exchangeCards(player, handHighest, scoreHighest, hand, score)
      }
      else {
        game.actions.junkDeck(player, 3)
      }
    }
  ],
}
