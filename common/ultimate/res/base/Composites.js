module.exports = {
  name: `Composites`,
  color: `red`,
  age: 9,
  expansion: `base`,
  biscuits: `ffhf`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer all but one card from your hand to my hand! Also, transfer the highest card from your score pile to my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game.cards.byPlayer(player, 'hand')
      const count = cards.length - 1
      game.actions.chooseAndTransfer(player, cards, game.zones.byPlayer(leader, 'hand'), { count })

      const highestScore = game.util.highestCards(
        game.cards.byPlayer(player, 'score')
      )
      game.actions.chooseAndTransfer(player, highestScore, game.zones.byPlayer(leader, 'score'))
    }
  ],
}
