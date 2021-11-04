const { evaluateEffect } = require('./util.js')
const { transitionFactory, markDone } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Choose',
      count: 1,
      options: context.data.options,
    }]
  })
}

function handleResponse(context) {
  const game = context.state
  const options = context.data.options
  const selected = context.response.option[0]

  for (const opt of options) {
    if (opt.name === selected) {
      markDone(context)
      return context.push('evaluate-effects', {
        name: opt.name,
        effects: opt.effects
      })
    }
  }

  throw new Error(`Selection (${selected}) doesn't match any options`)
}
