module.exports = {
  name: `Tasmanian Tiger`,
  color: `yellow`,
  age: 11,
  expansion: `arti`,
  biscuits: `shsl`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose a card in your score pile. Choose a top card of the same color on any player's board. Exchange the two cards. You may return two cards from your hand. If you do, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const scoreCard = game.actions.chooseCard(player, game.cards.byPlayer(player, 'score'))

        if (scoreCard) {
          const topChoices = game
            .players
            .all()
            .map(p => game.cards.top(p, scoreCard.color))
            .filter(card => Boolean(card))

          const topCard = game.actions.chooseCard(player, topChoices)

          if (topCard) {
            game.actions.transfer(player, scoreCard, game.zones.byPlayer(topCard.owner, topCard.color))
            game.actions.transfer(player, topCard, game.zones.byPlayer(player, 'score'))
          }
        }

        const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), {
          title: 'Return two cards to repeat this effect?',
          min: 0,
          max: 2,
        })

        if (returned && returned.length === 2) {
          continue
        }

        break
      }
    },
  ],
}
