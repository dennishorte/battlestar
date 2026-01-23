module.exports = {
  name: `Safe Deposit Box`,
  color: `red`,
  age: 7,
  expansion: `usee`,
  biscuits: `hcic`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may choose to either draw and junk two {7}, or exchange all cards in your score pile with all valued cards in the junk.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const options = ['Draw and junk', 'Exchange']
      const choice = game.actions.choose(player, options, {
        title: 'Choose an option'
      })[0]

      if (choice === 'Draw and junk') {
        game.actions.drawAndJunk(player, game.getEffectAge(self, 7))
        game.actions.drawAndJunk(player, game.getEffectAge(self, 7))
      }
      else if (choice === 'Exchange') {
        const scoreCards = game.cards.byPlayer(player, 'score')
        const valuedJunkCards = game
          .zones.byId('junk')
          .cardlist()
          .filter(card => card.age !== undefined)

        game.actions.exchangeCards(
          player,
          scoreCards,
          valuedJunkCards,
          game.zones.byPlayer(player, 'score'),
          game.zones.byId('junk'),
        )

        game.log.add({
          template: '{player} exchanges their score with the valued cards in junk',
          args: { player },
        })
      }
    },
  ],
}
