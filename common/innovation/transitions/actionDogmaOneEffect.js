const util = require('../../lib/util.js')

module.exports = function(context) {
  const { game, actor } = context
  const { sharing, demanding, effect } = context.data

  if (context.data.initialized) {
    return context.return(context.data.returned)
  }

  game.rk.addKey(context.data, 'initialized', true)

  const dogma = game
    .getCardData(effect.card)
    .getImpl(effect.kind)[effect.implIndex]
  const stepImpl = dogma.steps[effect.stepIndex]

  if (effect.stepIndex === 0) {
    game.mLog({
      template: dogma.dogma
    })
  }

  return stepImpl.func(context, actor)
}
