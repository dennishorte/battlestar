const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'select-player',
      func: _selectPlayer,
      resp: _selectPlayerHandleResponse,
    },
    {
      name: 'first-choice',
      func: _firstChoice,
      resp: _firstChoiceHandleResponse,
    },
    {
      name: 'second-choice',
      func: _secondChoice,
    },
  ]
})

function _selectPlayer(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  const choices = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .filter(p => p.name !== player.name)
    .map(p => p.name)

  if (choices.length === 0) {
    throw new Error(`Invalid Executive Order action; no valid targets`)
  }

  else if (choices.length === 1) {
    _selectPlayerDo(context, choices[0])
  }

  else {
    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Choose a Player',
        options: choices
      }]
    })
  }
}

function _selectPlayerHandleResponse(context) {
  _selectPlayerDo(context, bsgutil.optionName(context.response.option[0]))
}

function _firstChoice(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.target)

  return context.wait({
    actor: player.name,
    actions: [{
      name: 'First Choice',
      options: ['Movement', 'Action']
    }]
  })
}

function _firstChoiceHandleResponse(context) {
  const option = bsgutil.optionName(context.response.option[0])

  if (option === 'Movement') {
    return context.push('player-turn-movement', {
      playerName: context.data.target
    })
  }
  else {
    return context.push('player-turn-action', {
      playerName: context.data.target
    })
  }
}

function _secondChoice(context) {
  return context.push('player-turn-action', {
    playerName: context.data.target
  })
}

function _selectPlayerDo(context, playerName) {
  const game = context.state
  game.rk.addKey(context.data, 'target', playerName)
}
