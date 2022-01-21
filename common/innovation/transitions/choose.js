const selector = require('../../lib/selector.js')

module.exports = function(context) {
  if (context.response) {
    context.sendBack({ chosen: context.options })
    return context.done()
  }

  else {
    const { game, actor } = context
    const { kind, choices, reason } = context.data
    const { min, max } = selector.minMax(context.data)

    if (min > 0 && choices.length === 0) {
      game.mLog({
        template: '{player} cannot make a choice',
        args: {
          player: actor
        }
      })
    }

    // Auto-pick if the choice is limited
    if (choices.length <= min) {
      context.sendBack({ chosen: choices })
      return context.done()
    }

    else {
      return context.wait({
        actor: actor.name,
        name: `Choose ${kind}`,
        options: choices,
        min,
        max,
      })
    }
  }
}
