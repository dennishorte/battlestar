const { repeatSteps, transitionFactory2 } = require('./factory.js')
const {
  viperAttackOptionsForUnmanned,
  viperMovementOptionsForUnmanned,
} = require('./util.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  data: {
    selectedSpaceZone: '',
  },
  steps: repeatSteps(6, [
    {
      name: 'viperSelection',
      func: _selectViper,
      resp: _handleViperSelection,
    },
    {
      name: 'actionSelection',
      func: _selectAction,
      resp: _doAction,
    },
  ])
})

function _selectViper(context) {
  // Reset any value that might have been put in here on past actions
  _storeViperSelection(context, '')

  const game = context.state
  const options = []

  const viperZones = util.array.distinct(game.getUnmannedVipers())

  if (viperZones.length === 0) {
    game.mLog({
      template: 'No unmanned vipers available'
    })
    return context.done()
  }

  else if (viperZones.length === 1) {
    _storeViperSelection(context, `space.space${viperZones[0]}`)
  }

  else {
    return context.wait({
      actor: context.data.playerName,
      name: 'Select Viper to Activate',
      options: viperZones.map(i => `space.space${i}`)
    })
  }
}

function _handleViperSelection(context) {
  const game = context.state
  const selection = context.response.option[0]
  const selectionName = selection.name
  const spaceIndex = bsgutil.optionName(selection.option[0])
  _storeViperSelection(context, spaceIndex)
}

function _storeViperSelection(context, name) {
  const game = context.state
  game.rk.put(context.data, 'selectedSpaceZone', name)
}

function _selectAction(context) {
  const game = context.state
  const spaceZoneName = context.data.selectedSpaceZone

  const options = [
    viperMovementOptionsForUnmanned(game),
    viperAttackOptionsForUnmanned(game, spaceZoneName),
  ].filter(o => o !== undefined)

  return context.wait({
    actor: context.data.playerName,
    name: 'Activate Selected Viper',
    data: {
      selectedViper: spaceZoneName
    },
    options,
  })
}

function _doAction(context) {
  const game = context.state
  const selection = context.response.option[0]
  const actionName = selection.name

  if (actionName === 'Move Viper') {
    const direction = bsgutil.optionName(selection.option[0])
    game.aMoveViperUnmanned(
      context.data.playerName,
      context.data.selectedSpaceZone,
      direction
    )
  }

  else if (actionName === 'Attack with Viper') {
    const shipKind = bsgutil.optionName(selection.option[0])
    game.aAttackCylonWithViperByKind(
      context.data.playerName,
      context.data.selectedSpaceZone,
      shipKind
    )
  }

  else {
    throw new Error(`Unexpected viper action: ${actionName}`)
  }
}
