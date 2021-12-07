const { transitionFactory2 } = require('./factory.js')
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
  steps: [
    {
      name: 'viperSelection1',
      func: _selectViper,
      resp: _handleViperSelection,
    },
    {
      name: 'actionSelection1',
      func: _selectAction,
      resp: _doAction,
    },
    {
      name: 'viperSelection2',
      func: _selectViper,
      resp: _handleViperSelection,
    },
    {
      name: 'actionSelection2',
      func: _selectAction,
      resp: _doAction,
    },
  ],
})

function _selectViper(context) {
  // Reset any value that might have been put in here on past actions
  _storeViperSelection(context, '')

  const game = context.state
  const options = []

  const viperZones = util.array.distinct(game.getUnmannedVipers())
  const vipersInReserve = game.getZoneByName('ships.vipers').cards.length

  if (viperZones.length > 0) {
    options.push({
      name: 'select a viper to activate',
      options: viperZones.map(i => `space.space${i}`)
    })
  }

  if (vipersInReserve > 0) {
    options.push({
      name: 'launch a viper',
      options: [
        'space.space5',
        'space.space4',
      ]
    })
  }

  if (options.length === 0) {
    return context.done()
  }

  // There's only one possible thing for the player to do (activate a viper)
  else if (options.length === 1 && viperZones.length === 1) {
    _storeViperSelection(context, `space.space${viperZones[0]}`)
  }

  // The player must choose between several options
  else {
    return context.wait({
      actor: context.data.playerName,
      name: 'command action',
      options,
    })
  }
}

function _handleViperSelection(context) {
  const game = context.state
  const selection = context.response.option[0]
  const selectionName = selection.name

  if (selectionName === 'launch a viper') {
    const position = bsgutil.optionName(selection.option[0])
    game.mLog({
      template: '{player} launches a viper to {location}',
      args: {
        player: context.data.playerName,
        location: position,
      }
    })
    game.mLaunchViper(position)
  }

  else if (selectionName === 'select a viper to activate') {
    const spaceIndex = bsgutil.optionName(selection.option[0])
    _storeViperSelection(context, spaceIndex)
  }

  else {
    console.log(selection)
    throw new Error(`Unknown viper action: ${selection}`)
  }
}

function _storeViperSelection(context, name) {
  const game = context.state
  game.rk.put(context.data, 'selectedSpaceZone', name)
}

function _selectAction(context) {
  const game = context.state
  const spaceZoneName = context.data.selectedSpaceZone

  // Player launched a viper. No more choices to make for that.
  if (spaceZoneName === '') {
    return
  }

  const options = [
    viperMovementOptionsForUnmanned(game),
    viperAttackOptionsForUnmanned(game, spaceZoneName),
  ].filter(o => o !== undefined)

  return context.wait({
    actor: context.data.playerName,
    name: 'Activate Viper',
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
