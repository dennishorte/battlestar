const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  () => { throw new Error('No responses to handle in skill-check-post-reveal') }
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()

  if (!check.resolved) {
    game.rk.sessionStart(session => {
      session.put(check, 'resolved', true)
    })

    return context.push('evaluate-effects', {
      name: `${check.name}: ${check.result}`,
      effects: check.script[check.result],
    })
  }

  return context.done()
}
