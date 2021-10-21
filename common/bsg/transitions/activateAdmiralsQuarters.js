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
      .map(p => p.name)
      .filter(name => name !== context.data.playerName)

    return context.wait({
      actor: context.data.playerName,
      actions: [{
        name: 'Choose a Player',
        options,
      }]
    })
  }

  else if (context.data.step === 'check') {
    const result = game.getSkillCheck().result

    game.rk.sessionStart(() => {
      if (result === 'pass') {
        game.mLog({
          template: "We knew that {player} was a Cylon all along.",
          args: {
            player: context.data.chosenPlayerName
          }
        })
        game.mMovePlayer(context.data.chosenPlayerName, 'locations.brig')
      }
      else {
        game.mLog({
          template: "Nobody really believes that {player} is a Cylon",
          args: {
            player: context.data.chosenPlayerName
          }
        })
      }
    })
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
    })

    context.push('skill-check', {
      name: `Send ${chosenPlayer} to the brig`,
      skills: ['leadership', 'tactics'],
      'skill check value': 7,
      // 'partial pass value': null,
      'pass effect': `${chosenPlayerName} is sent to the brig`,
      // 'partial pass effect': null,
      // 'fail effect': null,
    })
  }
}
