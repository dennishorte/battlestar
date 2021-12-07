const { transitionFactory2 } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'select-crisis',
      func: _selectCrisis,
    },
    {
      name: 'gaius-draw-skill-card',
      func: _gaiusDrawSkillCard,
    },
    {
      name: 'before-crisis',
      func: _beforeCrisis,
    },
    {
      name: 'crisis',
      func: _crisis,
      resp: _handleResponse,
    },
    {
      name: 'after-crisis',
      func: _afterCrisis,
    },
  ],
})

function _selectCrisis(context) {
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
}

function _gaiusDrawSkillCard(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)
  if (character.name === 'Gaius Baltar') {
    return context.push('draw-skill-cards', {
      playerName: player.name,
      reason: 'Delusional Intuition',
    })
  }
}

function _beforeCrisis(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type === 'Cylon Attack') {
    game.aActivateCylonShips(crisis.cylonActivation)
    game.aDeployShips(crisis.deploy)
  }
}

function _crisis(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type === 'Cylon Attack') {
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

function _afterCrisis(context) {
  const game = context.state
  const crisis = game.getCrisis()

  if (crisis.type !== 'Cylon Attack') {
    game.aActivateCylonShips(crisis.cylonActivation)
    game.aPrepareForJump(crisis.jumpTrack)
    if (game.getCounterByName('jumpTrack') >= 4) {
      game.mLog({ template: 'auto-jumping the fleet' })
      return context.push('jump-the-fleet')
    }
    else {
      return context.done()
    }
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
