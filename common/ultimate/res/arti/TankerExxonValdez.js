module.exports = {
  name: `Exxon Valdez`,
  color: `red`,
  age: 10,
  expansion: `arti`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to junk all your cards. You lose!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const toRemove = [
        game.cards.byPlayer(player, 'hand'),
        game.cards.byPlayer(player, 'score'),
        game.cards.byPlayer(player, 'red'),
        game.cards.byPlayer(player, 'yellow'),
        game.cards.byPlayer(player, 'green'),
        game.cards.byPlayer(player, 'blue'),
        game.cards.byPlayer(player, 'purple'),
        game.cards.byPlayer(player, 'achievements'),
        game.cards.byPlayer(player, 'artifact'),
        game.cards.byPlayer(player, 'museum'),
      ].flat()

      game.actions.junkMany(player, toRemove)

      game.log.add({
        template: '{player} junks all of their cards',
        args: { player }
      })

      game.aYouLose(player, self)
    }
  ],
}
