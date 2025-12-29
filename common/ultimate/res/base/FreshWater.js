module.exports = {
  name: `Fresh Water`,
  color: `yellow`,
  age: 0,
  expansion: `surv`,
  biscuits: `rlhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Splay an unsplayed color on your board left. If you don't, you lose.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const splayed = game.actions.chooseAndSplay(player, game.util.colors(), 'left', { count: 1 })[0]
      if (!splayed) {
        game.aYouLose(player, self)
      }
    }
  ],
}
