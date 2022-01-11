const { phaseFactory, nextPhase } = require('../../lib/transitionFactory.js')

module.exports = phaseFactory({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'removeLoop',
      func: removeLoop,
    },
  ]
})

function initialize(context) {
  const { game } = context
  const { cards } = context.data.cards

  game.rk.addKey(context.data, 'cardIndex', -1)
  nextPhase(context)
}

function removeLoop(context) {
  const { game, actor } = context
  const { cards } = context.data

  const cardIndex = game.rk.increment(context.data, 'cardIndex')

  if (cardIndex < cards.length) {
    const card = cards[cardIndex]
    return game.aRemove(context, actor, card)
  }
  else {
    return nextPhase(context)
  }
}
