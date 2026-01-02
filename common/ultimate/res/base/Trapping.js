module.exports = {
  name: `Trapping`,
  color: `red`,
  age: 0,
  expansion: `base`,
  biscuits: `hrrl`,
  dogmaBiscuit: `r`,
  dogma: [
    `I demand you reveal your hand and all cards in my score pile! Transfer all cards in your hand of the colors of the cards in my score pile to my hand!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const handCards = game.cards.byPlayer(player, 'hand')
      const scoreCards = game.cards.byPlayer(leader, 'score')

      game.log.add({
        template: '{player} reveal their hand',
        args: { player }
      })
      game.actions.revealMany(player, handCards, { ordered: true })

      game.log.add({
        template: '{player} reveals the score cards of {player2}',
        args: { player, player2: leader }
      })
      game.actions.revealMany(player, scoreCards, { ordered: true })

      const toTransfer = handCards.filter(card => scoreCards.some(other => other.color === card.color))
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'hand'))
    }
  ],
}
