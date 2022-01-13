const { phaseFactory, nextPhase } = require('../../lib/transitionFactory.js')

module.exports = phaseFactory({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'drawLoop',
      func: drawLoop,
    },
  ]
})

function initialize(context) {
  const { game } = context
  const { count } = context.data

  game.rk.addKey(context.data, 'cardIndex', -1)
  nextPhase(context)
}

function drawLoop(context) {
  const { game, actor } = context
  const { count, age } = context.data

  const cardIndex = game.rk.increment(context.data, 'cardIndex')

  if (cardIndex < count) {
    return game.aDraw(context, actor, age)
  }
  else {
    return nextPhase(context)
  }
}
