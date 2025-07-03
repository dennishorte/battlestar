module.exports = {
  name: `Publications`,
  color: `blue`,
  age: 7,
  expansion: `base`,
  biscuits: `hsis`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay your yellow or blue cards up.`,
    `You may junk an available special achievement, or make a special achievement in the junk available.`,
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'up')
    },

    (game, player) => {
      const toJunkOptions = game.getAvailableSpecialAchievements()
      const fromJunkOptions = game
        .getZoneById('junk')
        .cards()
        .filter(c => c.isSpecialAchievement)

      let junked = false
      if (toJunkOptions.length > 0) {
        const toJunk = game.actions.chooseCard(player, toJunkOptions, {
          title: 'Junk a special achievement?',
          min: 0,
        })
        if (toJunk) {
          junked = true
          game.aRemove(player, toJunk)
        }
      }
      else {
        game.log.add({ template: 'no special achievements available' })
      }

      if (!junked && fromJunkOptions) {
        const fromJunk = game.actions.chooseCard(player, fromJunkOptions, {
          title: 'Optional: Return a special achievement from junk?',
          min: 0,
        })
        if (fromJunk) {
          junked = true
          game.mMoveCardTo(fromJunk, game.getZoneById('achievements'), { player })
        }
      }
      else if (!junked) {
        game.log.add({ template: 'no special achievements in junk' })
      }
    },
  ],
}
