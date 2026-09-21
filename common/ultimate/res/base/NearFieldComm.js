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
      const value = game.actions.chooseAge(leader)
      game.log.add({
        template: '{leader} chooses value {value}',
        args: { leader, value }
      })

      game.actions.transferMany(
        player,
        game.cards.byPlayer(player, 'score'),
        game.zones.byPlayer(leader, 'score'),
        { filter: card => card.getAge() === value }
      )
    },

    (game, player, { self }) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      if (scoreCards.length === 0) {
        game.log.addNoEffect()
        return
      }

      const card = game.actions.chooseHighest(player, scoreCards, 1)[0]
      if (card) {
        game.actions.reveal(player, card)
        game.actions.selfExecute(self, player, card)
      }
    }
  ],
}
