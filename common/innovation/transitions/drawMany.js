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
  game.rk.addKey(context.data, 'drawnCards', [])
  nextPhase(context)
}

function drawLoop(context) {
  const { game, actor } = context
  const { count, age, reveal } = context.data

  if (context.data.returned) {
    game.rk.push(context.data.drawnCards, context.data.returned)
  }

  const cardIndex = game.rk.increment(context.data, 'cardIndex')

  if (cardIndex < count) {
    return game.aDraw(context, actor, age, reveal)
  }
  else {
    nextPhase(context)
    return context.return(context.data.drawnCards)
  }
}
