const { transitionFactory, markDone } = require('./factory.js')

module.exports = transitionFactory(
  {
    consideredCommandAuthority: false,
  },
  generateOptions,
  () => { throw new Error('No responses to handle in skill-check-post-reveal') }
)

function generateOptions(context) {
  const game = context.state

  // Command Authority
  if (!context.data.consideredCommandAuthority) {
    const williamAdamaPlayer = game.getPlayerWithCard('William Adama')

    game.rk.sessionStart(session => {
      session.put(context.data, 'consideredCommandAuthority', true)

      if (williamAdamaPlayer && williamAdamaPlayer.oncePerGameUsed) {
        game.mLog({
          template: 'William Adama has already used his Command Authority ability this game'
        })
      }
    })

    if (williamAdamaPlayer && !williamAdamaPlayer.oncePerGameUsed) {
      return context.push('skill-check-command-authority')
    }
  }

  _cleanUpSkillCheck(game)

  return context.done()
}

function _cleanUpSkillCheck(game) {
  // Clear crisis pool cards
  // Store skill check
  // Clear skill check
}
