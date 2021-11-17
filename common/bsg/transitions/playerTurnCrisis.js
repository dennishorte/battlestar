const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')


module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

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
    game.aActivateCylonShips(crisis.cylonActivation)
    game.aDeployShips(crisis.deploy)
    if (crisis.script.effect) {
      markDone(context)
      return context.push('evaluate-effects', {
        name: `${crisis.name}: special effects`,
        effects: crisis.script.effect,
      })
    }
    else {
      return context.done()
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
    const check = game.getSkillCheck()

    game.rk.sessionStart(() => {
      game.mSetSkillCheck(crisis)
    })

    markDone(context)
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
    markDone(context)
    return context.push('evaluate-effects', {
      name: `${crisis.name} option ${optionNumber}`,
      effects: crisis.script[`option${optionNumber}`],
    })
  }
}
