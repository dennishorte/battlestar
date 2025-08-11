module.exports = {
  name: `Fortune Cookie`,
  color: `purple`,
  age: 7,
  expansion: `usee`,
  biscuits: `hllc`,
  dogmaBiscuit: `l`,
  dogma: [
    `If you have exactly seven of any icon on your board, draw and score a {7}; exactly eight, splay your green or purple cards right and draw an {8}; exactly nine, draw a {9}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const biscuits = game.getBiscuits()[player.name]

      const exactlySevenIcon = Object.values(biscuits).find(count => count === 7)
      const exactlyEightIcon = Object.values(biscuits).find(count => count === 8)
      const exactlyNineIcon = Object.values(biscuits).find(count => count === 9)

      if (exactlySevenIcon) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 7))
      }

      if (exactlyEightIcon) {
        game.actions.chooseAndSplay(player, ['green', 'purple'], 'right')
        game.actions.draw(player, { age: game.getEffectAge(self, 8) })
      }

      if (exactlyNineIcon) {
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
      }

      if (!exactlySevenIcon && !exactlyEightIcon && !exactlyNineIcon) {
        game.log.addNoEffect()
      }
    },
  ],
}
