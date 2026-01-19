export default {
  name: `Gujin Tushu Jinsheng`,
  color: `yellow`,
  age: 5,
  expansion: `arti`,
  biscuits: `schs`,
  dogmaBiscuit: `s`,
  dogma: [
    `If it is your turn, choose any top card on any other board and super-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      if (player.id !== game.players.current().id) {
        game.log.add({
          template: 'It is not {player} turn',
          args: { player }
        })
        return
      }

      const choices = game
        .players
        .other(player)
        .flatMap(player => game.cards.tops(player))
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aSuperExecute(self, player, card)
      }
    }
  ],
}
