module.exports = {
  name: `Democracy`,
  color: `purple`,
  age: 6,
  expansion: `base`,
  biscuits: `cssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return any number of cards from your hand. If you have returned more cards than any opponent due to Democracy so far during this dogma action, draw and score an {8}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (!game.state.dogmaInfo.democracyMaxReturned) {
        game.state.dogmaInfo.democracyMaxReturned = 0
        game.state.dogmaInfo.democracyLastPlayer = ''
      }
      const hand = game.cards.byPlayer(player, 'hand')
      const cards = game.actions.chooseAndReturn(player, hand, { min: 0, max: hand.length })

      if (
        game.state.dogmaInfo.democracyLastPlayer === player.name
        || cards.length > game.state.dogmaInfo.democracyMaxReturned
      ) {
        game.aDrawAndScore(player, game.getEffectAge(self, 8))
        if (cards.length > game.state.dogmaInfo.democracyMaxReturned) {
          game.state.dogmaInfo.democracyMaxReturned = cards.length
          game.state.dogmaInfo.democracyLastPlayer = player.name
        }
      }
    }
  ],
}
