const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state

  const options = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .filter(p => game.getZoneByPlayerLocation(p).name !== 'locations.brig')
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .map(p => p.name)

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Choose a Player',
      options,
    }]
  })
}

function handleResponse(context) {
  const game = context.state

  const chosenPlayerName = context.response.option[0]
  const chosenPlayer = game.getPlayerByName(chosenPlayerName)
  util.assert(!!chosenPlayer, `Invalid player chosen: ${chosenPlayerName}`)

  game.mSetSkillCheck({
    name: `Send ${chosenPlayerName} to the brig`,
    skills: ['leadership', 'tactics'],
    passValue: 7,
    partialValue: 0,
    passEffect: `${chosenPlayerName} is sent to the brig`,
    partialEffect: '',
    failEffect: '',
    script: {
      pass: [{
        kind: 'move',
        actor: chosenPlayerName,
        location: 'Brig',
      }],
      fail: [],
    }
  })
  markDone(context)
  return context.push('skill-check')
}
