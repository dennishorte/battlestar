const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {
    step: 'choose',
    chosenPlayerName: '',
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state

  if (context.data.step === 'choose') {
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

  else if (context.data.step === 'check') {
    return context.done()
  }

  else {
    throw new Error(`Unknown step: ${context.data.step}`)
  }
}

function handleResponse(context) {
  const game = context.state

  if (context.data.step === 'choose') {
    const chosenPlayerName = context.response.option[0]
    const chosenPlayer = game.getPlayerByName(chosenPlayerName)
    util.assert(!!chosenPlayer, `Invalid player chosen: ${chosenPlayerName}`)

    game.rk.sessionStart(session => {
      session.put(context.data, 'chosenPlayerName', chosenPlayerName)
      session.put(context.data, 'step', 'check')
      game.mClearWaiting()

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
    })
    return context.push('skill-check')
  }
}
