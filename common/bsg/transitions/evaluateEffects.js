const { evaluateEffect } = require('./util.js')
const { transitionFactory } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {
    effectIndex: 0,
  },
  generateOptions,
  () => { throw new Error('There should never be a response to evaluate-card-effect') },
)

function generateOptions(context) {
  const game = context.state
  const details = context.data.effects
  const effects = details.effect || details
  const effectIndex = context.data.effectIndex

  // Our first time visiting this function
  if (effectIndex === 0) {
    game.mLog({
      template: `Evaluating effects of ${context.data.name}`,
    })

    if (details.dieRoll && !bsgutil.rollDieResult(details.dieRoll)) {
      game.mLog({ template: "Die roll didn't match; no effect" })
      return context.done()
    }
  }

  // All effects have been evaluated (or, there were no effects)
  if (effectIndex >= effects.length) {
    return context.done()
  }

  // Mark that next time we visit this function, we should do the next index
  game.rk.increment(context.data, 'effectIndex')

  const result = evaluateEffect(game, effects[effectIndex])

  // Pause and wait for humans to decide something
  if (result && result.push) {
    return context.push(result.push.transition, result.push.payload)
  }

  // Go on to the next iteration
  else {
    return generateOptions(context)
  }
}
