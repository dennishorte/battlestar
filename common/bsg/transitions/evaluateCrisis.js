const { transitionFactory2 } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'crisis',
      func: _crisis,
      resp: _handleResponse,
    },
  ],
})

function _crisis(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type === 'Cylon Attack') {
    game.aActivateCylonShips(crisis.cylonActivation)
    game.aDeployShips(crisis.deploy)
    if (crisis.script.effect) {
      return context.push('evaluate-effects', {
        name: `${crisis.name}: special effects`,
        effects: crisis.script.effect,
      })
    }
  }

  else if (crisis.type === 'Choice') {
    let actor
    if (crisis.actor === 'Current player') {
      actor = game.getPlayerCurrentTurn()
    }
    else {
      actor = game.getPlayerWithCard(crisis.actor)
    }

    return context.wait({
      actor: actor.name,
      name: 'Choose',
      count: 1,
      options: [
        {
          name: 'Option 1',
          description: crisis.option1
        },
        {
          name: 'Option 2',
          description: crisis.option2
        },
      ],
    })
  }

  else {
    game.mSetSkillCheck(crisis)
    return context.push('skill-check')
  }
}

function _handleResponse(context) {
  const game = context.state
  const crisis = game.getCrisis()
  const action = context.response.name
  const option = context.response.option

  // Player Choice crisis response
  if (action === 'Choose') {
    const optionNumber = parseInt(option[0].slice(-1))
    return context.push('evaluate-effects', {
      name: `${crisis.name} option ${optionNumber}`,
      effects: crisis.script[`option${optionNumber}`],
    })
  }
}
