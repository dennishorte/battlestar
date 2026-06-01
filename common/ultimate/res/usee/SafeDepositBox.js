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
      const options = [
        game.actions.option({ id: 'draw-junk', title: 'Draw and junk' }),
        game.actions.option({ id: 'exchange', title: 'Exchange' }),
      ]
      const pick = game.actions.choose(player, options, {
        title: 'Choose an option'
      })[0]
      const choice = (pick && typeof pick === 'object') ? pick.id : pick

      if (choice === 'draw-junk' || choice === 'Draw and junk') {
        game.actions.drawAndJunk(player, game.getEffectAge(self, 7))
        game.actions.drawAndJunk(player, game.getEffectAge(self, 7))
      }
      else if (choice === 'exchange' || choice === 'Exchange') {
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
