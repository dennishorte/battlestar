const selector = require('../../lib/selector.js')

module.exports = function(context) {
  if (context.response) {
    context.return(context.options)
  }

  else {
    const { game, actor } = context
    const { colors, reason } = context.data
    const { min, max } = selector.minMax(context.data)

    // Auto-pick if the choice is limited
    if (colors.length <= min) {
      return context.return(colors)
    }

    else {
      return context.wait({
        actor: actor.name,
        name: 'Choose Colors',
        options: colors,
        min,
        max,
      })
    }
  }
}
