const selector = require('../../lib/selector.js')

module.exports = function(context) {
  if (context.response) {
    context.return(context.options)
  }

  else {
    const { game, actor } = context
    const { kind, choices, reason } = context.data
    const { min, max } = selector.minMax(context.data)

    // Auto-pick if the choice is limited
    if (choices.length <= min) {
      return context.return(choices)
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
