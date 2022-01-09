module.exports = function(context) {
  const { game, actor } = context
  const { effect, stepIndex } = context.data

  // If this was already called, it will have finished, or put something on the stack.
  // We can safely return.
  if (context.data.initialized) {
    return context.return(context.data.returned)
  }

  game.rk.addKey(context.data, 'initialized', true)

  const card = game.getCardData(effect.card)
  const stepImpl = card.getImpl(effect.kind)[effect.implIndex].steps[stepIndex]
  return stepImpl.func(context, actor)
}
