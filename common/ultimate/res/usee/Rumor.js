module.exports = {
  name: `Rumor`,
  color: `green`,
  age: 1,
  expansion: `usee`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Return a card from your score pile. If you do, draw a card of value one higher than the card you returned.`,
    `Transfer a card from your hand to the hand of the player on your left.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.cards.byPlayer(player, 'score')
      const returned = game.aChooseAndReturn(player, choices, {
        title: 'Return a card from your score pile',
        count: 1,
      })[0]

      if (returned) {
        game.aDraw(player, { age: returned.age + 1 })
      }
    },

    (game, player) => {
      const choices = game.cards.byPlayer(player, 'hand')
      const card = game.actions.chooseCard(player, choices)

      if (card) {
        const playerOnLeft = game.players.following(player)
        game.aTransfer(player, card, game.zones.byPlayer(playerOnLeft, 'hand'))
      }
    }
  ],
}
