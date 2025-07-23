module.exports = {
  name: `Machinery`,
  color: `yellow`,
  age: 3,
  expansion: `base`,
  biscuits: `llhk`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you exchange all the cards in your hand with all the highest cards in my hand!`,
    `Score a card from your hand with a {k}.`,
    `You may splay your red cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const playerHand = game.zones.byPlayer(player, 'hand')
      const leaderHand = game.zones.byPlayer(leader, 'hand')

      const yours = playerHand.cards()
      const mine = game.utilHighestCards(leaderHand.cards())

      game.aExchangeCards(
        player,
        yours,
        mine,
        playerHand,
        leaderHand
      )

      game.log.add({
        template: '{player} steals {count} cards from {player2}',
        args: {
          player: leader,
          count: yours.length,
          player2: player,
        }
      })
      game.log.add({
        template: '{player} give back {count} cards to {player2}',
        args: {
          player: leader,
          count: mine.length,
          player2: player,
        }
      })
    },

    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      game.actions.chooseAndScore(player, choices)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'left')
    },
  ],
}
