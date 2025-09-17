module.exports = {
  name: 'Rocketry',
  color: 'blue',
  age: 8,
  expansion: 'base',
  biscuits: 'iiih',
  dogmaBiscuit: 'i',
  dogma: [
    //    "Return a card in any opponent's score pile for every color on your board with {i}",
    "Choose an opponent. Return a card in that player's score pile for every color on your board with {i}",
  ],
  dogmaImpl: [
    (game, player) => {
      const biscuits = game.getBiscuitsByColor(player)
      const count = Object
        .values(biscuits)
        .map(x => x.i)
        .filter(x => x > 0)
        .length

      const opp = game.actions.choosePlayer(player, game.players.opponents(player))
      game.actions.chooseAndReturn(player, game.cards.byPlayer(opp, 'score'), { count })
    }
  ],
}
