module.exports = {
  name: `Metric System`,
  color: `green`,
  age: 6,
  expansion: `base`,
  biscuits: `hfcc`,
  dogmaBiscuit: `c`,
  dogma: [
    `If your green cards are splayed right, you may splay any one color of your cards right.`,
    `You may splay your green cards right.`
  ],
  dogmaImpl: [
    (game, player) => {
      if (game.zones.byPlayer(player, 'green').splay === 'right') {
        game.actions.chooseAndSplay(player, null, 'right')
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'right')
    }
  ],
}
