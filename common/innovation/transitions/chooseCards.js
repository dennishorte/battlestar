const selector = require('../../lib/selector.js')

module.exports = function(context) {
  if (context.response) {
    context.return(context.options)
  }

  else {
    const { game, actor } = context
    const { cards, reason } = context.data
    const { min, max } = selector.minMax(context.data)

    // Auto-pick if the choice is limited
    if (cards.length <= min) {
      return context.return(cards)
    }

    else {
      return context.wait({
        actor: actor.name,
        name: 'Choose Cards',
        options: cards,
        min,
        max,
      })
    }
  }
}
