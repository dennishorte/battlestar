const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()
}

function handleResponse(context) {
}
