const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'splay',
      func: splay
    },
    {
      name: 'achievementCheck',
      func: achievementCheck,
    },
  ]
})

function karma(context) {
  const { game } = context
  // return game.aCheckTriggers(context, 'before-splay')
}

function splay(context) {
  const { game, actor } = context
  const { color, direction } = context.data
  game.mSplay(actor, color, direction)
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}
