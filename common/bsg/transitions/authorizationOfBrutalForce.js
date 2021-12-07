const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'chooseTarget',
      func: _chooseType,
      resp: _chooseTypeSave,
    },
    {
      name: 'destroyTarget',
      func: _chooseTarget,
      resp: _destroyTarget,
    },
    {
      name: 'cleanup',
      func: _cleanup,
    }
  ],
})

function _chooseType(context) {
  const game = context.state

  // List up possible targets
  const targets = []
  if (game.getCenturionNext()) {
    targets.push('centurion')
  }
  if (game.getCardsHeavyRaiders().length > 0) {
    targets.push('heavy raider')
  }
  if (game.getCardsRaiders().length > 0) {
    targets.push('raiders')
  }

  if (targets.length === 0) {
    game.mLog({ template: 'No targets for brutal force' })
    return context.done()
  }

  else if (targets.length === 1) {
    _saveSelectedTarget(context, targets[0])
  }

  else {
    return context.wait({
      actor: context.data.playerName,
      name: 'Select Target of Brutal Force',
      options: targets,
    })
  }
}

function _chooseTypeSave(context) {
  _saveSelectedTarget(context, context.response.option[0])
}

function _saveSelectedTarget(context, option) {
  const game = context.state
  option = bsgutil.optionName(option)
  game.rk.addKey(context.data, 'selectedTarget', option)
  game.mLog({
    template: '{player} authorizes brutal force against {target}',
    args: {
      player: context.data.playerName,
      target: option
    }
  })
}

function _chooseTarget(context) {
  const game = context.state
  const target = context.data.selectedTarget
  let targetIds

  if (target === 'centurion') {
    game.mDiscard(game.getCenturionNext())
    game.mLog({ template: 'Centurion destroyed' })
    return
  }

  else if (target === 'heavy raider') {
    targetIds = game.getCardsHeavyRaiders()
  }

  else if (target === 'raiders') {
    targetIds = game.getCardsRaiders()
  }

  else {
    throw new Error(`Unknown target for Brutal Force: ${target}`)
  }

  return context.wait({
    actor: context.data.playerName,
    name: 'Select Ships for Brutal Force',
    options: targetIds
  })
}

function _destroyTarget(context) {
  const game = context.state
  for (const opt of context.response.option) {
    const cardId = bsgutil.optionName(opt)
    const card = game.getCardById(cardId)
    const zone = game.getZoneByCard(card)
    game.mDiscard(card)
    game.mLog({
      template: '{card} destroyed at {zone} with use of Brutal Force',
      args: {
        card,
        zone
      }
    })
  }
}

function _cleanup(context) {
  const game = context.state

  // Possibly reduce population
  const dieRoll = bsgutil.rollDie()
  if (dieRoll <= 2) {
    game.mLog({ template: 'The use of brutal force led to some unexpected casualties' })
    game.mAdjustCounterByName('population', -1)
  }

  // Discard the quorum card
  const card = game.getCardByName('Authorization of Brutal Force')
  game.mDiscard(card)
}
