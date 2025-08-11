module.exports = {
  name: `Novel`,
  color: `purple`,
  age: 3,
  expansion: `echo`,
  biscuits: `h3c&`,
  dogmaBiscuit: `c`,
  echo: `Return all cards from your forecast.`,
  dogma: [
    `Draw a {3}.`,
    `You may splay your purple cards left.`,
    `If all your non-purple top cards share a common icon other than {c}, claim the Supremacy achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.draw(player, { age: game.getEffectAge(this, 3) })
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'left')
    },

    (game, player) => {
      if (!game.checkAchievementAvailable('Supremacy')) {
        game.log.addNoEffect()
        return
      }

      const biscuits = game
        .cards.tops(player)
        .filter(card => card.color !== 'purple')
        .map(card => card.biscuits)

      if (biscuits.length === 0) {
        game.log.addNoEffect()
        return
      }

      for (const biscuit of Object.keys(game.util.emptyBiscuits())) {
        if (biscuit === 'c') {
          continue
        }

        if (biscuits.every(b => b.includes(biscuit))) {
          game.aClaimAchievement(player, { name: 'Supremacy' })
          return
        }
      }

      game.log.addNoEffect()
    }
  ],
  echoImpl: (game, player) => {
    game.actions.returnMany(player, game.cards.byPlayer(player, 'forecast'))
  },
}
