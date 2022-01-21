const util = require('../../lib/util.js')

module.exports = function(context) {
  const { game, actor } = context
  const { effect, stepIndex } = context.data

  // If this was already called, it will have finished, or put something on the stack.
  // We can safely return.
  if (context.data.initialized) {
    context.sendBack(context.sentBack) // Pass sent back values on back further.
    return context.done()
  }

  game.rk.addKey(context.data, 'initialized', true)
  const card = game.getCardData(effect.card)
  const stepImpl = card.getImpl(effect.kind)[effect.implIndex].steps[stepIndex]

  util.assert(typeof (stepImpl.func) === 'function', `Invalid impl func in ${JSON.stringify(effect)}`)

  context.sentBack = context.data.sentBack || {}
  const result = stepImpl.func(context, actor, effect.data)

  if (result) {
    return result
  }
  else {
    return context.done()
  }
}
