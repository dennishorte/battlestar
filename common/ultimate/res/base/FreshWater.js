module.exports = {
  name: `Fresh Water`,
  color: `yellow`,
  age: 0,
  expansion: `base`,
  biscuits: `rlhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Splay an unsplayed color on your board left. If you don't, you lose.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .util
        .colors()
        .filter(color => {
          const unsplayedCondition = game.zones.byPlayer(player, color).splay === 'none'
          const canSplayCondition = game.cards.byPlayer(player, color).length > 1
          return unsplayedCondition && canSplayCondition
        })

      const splayed = game.actions.chooseAndSplay(player, choices, 'left', { count: 1 })[0]
      if (!splayed) {
        game.aYouLose(player, self)
      }
    }
  ],
}
