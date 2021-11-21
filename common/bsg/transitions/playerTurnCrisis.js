const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')


module.exports = transitionFactory(
  {
    goToCylonActivation: false,
    goToPrepareForJump: false,
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (game.checkPlayerIsRevealedCylon(player)) {
    game.mLog({ template: 'Crisis phase skipped for Cylon players' })
    return context.done()
  }

  // Initialization
  if (!game.getCrisis()) {
    if (game.getCardCharacterByPlayer(player).name === "Laura Roslin") {
      return context.push('player-turn-crisis-laura-roslin')
    }

    else {
      game.aBeginCrisis()
    }
  }

  const crisis = game.getCrisis()

  if (crisis.type === 'Cylon Attack') {
    if (!context.data.goToPrepareForJump) {
      game.rk.put(context.data, 'goToPrepareForJump', true)
      game.aActivateCylonShips(crisis.cylonActivation)
      game.aDeployShips(crisis.deploy)
      if (crisis.script.effect) {
        return context.push('evaluate-effects', {
          name: `${crisis.name}: special effects`,
          effects: crisis.script.effect,
        })
      }
    }
    return context.done()
  }

  else if (crisis.type === 'Choice') {
    if (context.data.goToCylonActivation) {
      return _cylonActivation(context)
    }

    game.rk.put(context.data, 'goToCylonActivation', true)

    let actor
    if (crisis.actor === 'Current player') {
      actor = game.getPlayerCurrentTurn()
    }
    else {
      actor = game.getPlayerWithCard(crisis.actor)
    }

    return context.wait({
      actor: actor.name,
      actions: [{
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
      }]
    })
  }

  else if (crisis.type === 'Skill Check' || crisis.type === 'Optional Skill Check') {
    if (context.data.goToCylonActivation) {
      return _cylonActivation(context)
    }

    game.rk.put(context.data, 'goToCylonActivation', true)
    game.mSetSkillCheck(crisis)

    return context.push('skill-check')
  }

  else {
    throw new Error(`Unknown crisis type: ${crisis.type}`)
  }
}

function handleResponse(context) {
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

function _cylonActivation(context) {
  const game = context.state
  const crisis = game.getCrisis()
  game.aActivateCylonShips(crisis.cylonActivation)
  game.aPrepareForJump(crisis.jumpTrack)
  if (game.getCounterByName('jumpTrack') >= 4) {
    markDone(context)
    game.mLog({ template: 'auto-jumping the fleet' })
    return context.push('jump-the-fleet')
  }
  else {
    return context.done()
  }
}
