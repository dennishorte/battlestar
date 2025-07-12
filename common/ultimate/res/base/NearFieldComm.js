module.exports = {
  name: `Near-Field Comm`,
  color: `yellow`,
  age: 11,
  expansion: `base`,
  biscuits: `hcpp`,
  dogmaBiscuit: `p`,
  dogma: [
    `I demand you transfer all the cards of the value of my choice from your score pile to my score pile!`,
    `Reveal and self-execute the highest card in your score pile.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const value = game.aChooseAge(leader)
      game.log.add({
        template: '{leader} chooses value {value}',
        args: { leader, value }
      })

      const cardsToTransfer = game
        .cards.byPlayer(player, 'score')
        .filter(card => card.getAge() === value)

      game.aTransferMany(player, cardsToTransfer, game.zones.byPlayer(leader, 'score'))
    },

    (game, player) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      if (scoreCards.length === 0) {
        game.log.addNoEffect()
        return
      }

      // Find the highest card
      const highest = Math.max(...scoreCards.map(card => card.getAge()))
      const highestCards = scoreCards.filter(card => card.getAge() === highest)

      const card = game.actions.chooseCard(player, highestCards)
      if (card) {
        game.mReveal(player, card)
        game.aSelfExecute(player, card)
      }
    }
  ],
}
