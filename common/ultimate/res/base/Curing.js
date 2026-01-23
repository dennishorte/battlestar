module.exports = {
  name: `Curing`,
  color: `blue`,
  age: 0,
  expansion: `base`,
  biscuits: `chrc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score another top card with a {r} on your board. If you don't, you lose.`,
    `You may exchange all cards in your hand with all the highest cards in an opponent's score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const scoreChoices = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBiscuit('r'))
        .filter(card => card.id !== self.id)

      const scored = game.actions.chooseAndScore(player, scoreChoices)[0]

      if (!scored) {
        game.youLose(player, self.name)
      }
    },
    (game, player) => {
      const doExchange = game.actions.chooseYesNo(player, 'Exchange cards?')
      if (doExchange) {
        const opponent = game.actions.choosePlayer(player, game.players.opponents(player))
        const handZone = game.zones.byPlayer(player, 'hand')
        const handCards = handZone.cardlist()
        const scoreZone = game.zones.byPlayer(opponent, 'score')
        const scoreCards = game.util.highestCards(scoreZone.cardlist())
        game.actions.exchangeCards(player, handCards, scoreCards, handZone, scoreZone)
      }
    },
  ],
}
