const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choose',
      func: choose
    },
    {
      name: 'splay',
      func: splay
    },
  ]
})

function choose(context) {
  const { game, actor } = context
  const { direction } = context.data

  let choices = context.data.choices
  if (choices) {
    choices = choices
      .filter(color => game.getZoneColorByPlayer(actor, color).splay !== direction)
  }
  else {
    choices = game.getColorsForSplaying(actor, direction)
  }

  return game.aChoose(context, {
    playerName: actor.name,
    kind: 'Color',
    choices,
    min: 0,
    max: 1,
  })
}

function splay(context) {
  const { game, actor } = context
  const { direction, returned } = context.data

  const colorToSplay = returned[0]

  if (colorToSplay) {
    return game.aSplay(context, actor, colorToSplay, direction)
  }
  else {
    game.mLog({
      template: '{player} splays nothing {direction}',
      args: {
        player: actor,
        direction
      }
    })
    return context.done()
  }
}
