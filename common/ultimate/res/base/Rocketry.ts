export default {
  name: 'Rocketry',
  color: 'blue',
  age: 8,
  expansion: 'base',
  biscuits: 'iiih',
  dogmaBiscuit: 'i',
  dogma: [
    "Choose an opponent. Return a card in that player's score pile for every color on your board with {i}",
  ],
  dogmaImpl: [
    (game, player) => {
      const count = Object
        .values(player.biscuitsByColor())
        .map(x => x.i)
        .filter(x => x > 0)
        .length

      const opp = game.actions.choosePlayer(player, game.players.opponents(player))
      game.actions.chooseAndReturn(player, game.cards.byPlayer(opp, 'score'), { count })
    }
  ],
}
