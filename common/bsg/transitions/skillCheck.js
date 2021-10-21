const { transitionFactory, markDone } = require('./factory.js')


/* const steps = [
 *   'discuss',
 *   'pre-check modifiers',
 *   'play cards',
 *   'reveal',
 *   'post-check modifiers',
 * ] */


module.exports = transitionFactory(
  {
    step: 'discuss',
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const step = context.data.step

  if (step === 'discuss') {
    context.wait({
      actor: 'micah',
      actions: [{
        name: 'Skill Check - Discuss',
        options: [],
      }],
    })
  }

  else {
    throw new Error(`Unknown step: ${step}`)
  }
}

function handleResponse(context) {
}
