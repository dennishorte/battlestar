const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choose',
      func: choose
    },
    {
      name: 'tuck',
      func: tuck
    },
  ]
})

function choose(context) {
  const { game, actor } = context
  const { choices } = context.data

  return game.aChoose(context, {
    playerName: actor.name,
    kind: 'Card',
    choices,
    min: 0,
    max: 1,
  })
}

function tuck(context) {
  const { game, actor } = context
  const { direction } = context.data

  const cardToTuck = context.sentBack.chosen[0]

  if (cardToTuck) {
    return game.aTuck(context, actor, cardToTuck)
  }
  else {
    game.mLog({
      template: '{player} tucks nothing',
      args: {
        player: actor,
      }
    })
    return context.done()
  }
}
