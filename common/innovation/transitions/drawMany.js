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

  if (context.sentBack.card) {
    game.rk.push(context.data.drawnCards, context.sentBack.card)
  }

  const cardIndex = game.rk.increment(context.data, 'cardIndex')

  if (cardIndex < count) {
    return game.aDraw(context, actor, age, reveal)
  }
  else {
    nextPhase(context)
    context.sendBack({ cards: context.data.drawnCards })
    return context.done()
  }
}
