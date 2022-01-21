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

  const payload = {
    playerName: actor.name,
    kind: 'Card',
    choices,
  }
  if (context.data.count) {
    payload.count = context.data.count
  }
  else {
    if (context.data.min) {
      payload.min = context.data.min
    }
    if (context.data.max) {
      payload.max = context.data.max
    }
  }

  return game.aChoose(context, payload)
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
