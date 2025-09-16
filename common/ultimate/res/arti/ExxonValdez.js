
module.exports = {
  name: `Exxon Valdez`,
  color: `red`,
  age: 10,
  expansion: `arti`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to remove all cards from your hand, score pile, board, and achievements from the game. You lose! If there is only one player remaining in the game, that player wins!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const toRemove = [
        game.getCardsByZone(player, 'hand'),
        game.getCardsByZone(player, 'score'),
        game.getCardsByZone(player, 'red'),
        game.getCardsByZone(player, 'yellow'),
        game.getCardsByZone(player, 'green'),
        game.getCardsByZone(player, 'blue'),
        game.getCardsByZone(player, 'purple'),
        game.getCardsByZone(player, 'achievements'),
      ].flat()

      game.aRemoveMany(player, toRemove)

      game.mLog({
        template: '{player} junks all of their cards',
        args: { player }
      })

      game.aYouLose(player, self)
    }
  ],
}
