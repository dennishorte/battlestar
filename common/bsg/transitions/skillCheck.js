const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {
    steps: [
      'skill-check-discuss',
      'skill-check-add-cards',
      'skill-check-post-reveal',
      'skill-check-resolve',
      'skill-check-cleanup',
    ],
    stepIndex: 0,
  },
  generateOptions,
  () => { throw new Error('No responses expected in skill-check') }
)

function generateOptions(context) {
  if (context.data.stepIndex >= context.data.steps.length) {
    return context.done()
  }

  const game = context.state
  const check = game.getSkillCheck()

  // Skill check was short-cut by something
  if (check && check.shortCut && context.data.stepIndex < 3) {
    game.rk.sessionStart(session => {
      session.put(context.data, 'stepIndex', 3)
      session.put(check, 'result', check.shortCut)
    })
  }

  const step = context.data.steps[context.data.stepIndex]
  game.rk.sessionStart(session => {
    session.put(context.data, 'stepIndex', context.data.stepIndex + 1)
  })

  return context.push(step)
}
