const { transitionFactory2, markDone } = require('./factory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'showResults',
      func: showResults,
      resp: () => {}  // no-op
    },
    {
      name: 'commandAuthority',
      func: commandAuthority,
    },
    {
      name: 'finish',
      func: finish
    },
  ]
})

function showResults(context) {
  const game = context.state

  return context.wait({
    actor: game.getPlayerCurrentTurn().name,
    name: 'Acknowledge Results',
    options: ['acknowledged']
  })
}

function commandAuthority(context) {
  const game = context.state
  const williamAdamaPlayer = game.getPlayerWithCard('William Adama')

  if (williamAdamaPlayer && !williamAdamaPlayer.oncePerGameUsed) {
    return context.push('skill-check-command-authority')
  }
}

function finish(context) {
  const game = context.state

  const crisisPool = game.getZoneByName('crisisPool')

  while (crisisPool.cards.length) {
    game.mDiscard(crisisPool.cards[0])
  }

  game.rk.push(game.state.pastSkillChecks, game.getSkillCheck())
  game.rk.put(game.state, 'skillCheck', {})
}
