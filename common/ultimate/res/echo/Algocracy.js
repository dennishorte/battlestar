module.exports = {
  name: `Algocracy`,
  color: `green`,
  age: 11,
  expansion: `echo`,
  biscuits: `hiib`,
  dogmaBiscuit: `i`,
  dogma: [
    `Choose a biscuit type. Transfer all cards with that featured biscuit from all hands and score piles to the hand of the single player with the most of the chosen biscuit on their board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const biscuit = game.actions.chooseBiscuit(player)
      const sortedPlayers = Object
        .entries(game.getBiscuits())
        .map(([name, biscuits]) => ({ name, count: biscuits[biscuit] }))
        .sort((l, r) => r.count - l.count)

      if (sortedPlayers[0].count === sortedPlayers[1].count) {
        game.log.add({
          template: 'There is no single player with the most {biscuit}',
          args: { biscuit }
        })
        return
      }
      else {
        const holderOfTheMost = game.players.byName(sortedPlayers[0].name)
        game.log.add({
          template: '{player} has the most {biscuit}',
          args: { player: holderOfTheMost, biscuit }
        })

        const toTransfer = game
          .players
          .all()
          .flatMap(player => [
            ...game.cards.byPlayer(player, 'hand'),
            ...game.cards.byPlayer(player, 'score'),
          ])
          .filter(card => card.dogmaBiscuit === biscuit)

        game.actions.transferMany(player, toTransfer, game.zones.byPlayer(holderOfTheMost, 'hand'))
      }
    }
  ],
}
