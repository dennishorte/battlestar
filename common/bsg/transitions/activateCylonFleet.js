const { markDone, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'chooseActivation',
      func: _chooseActivation,
      resp: _chooseActivationResp,
    },
  ],
})

function _chooseActivation(context) {
  const game = context.state

  const shipTypes = []
  for (const info of game.getCardsEnemyShips()) {
    if (info.card.name.startsWith('Basestar')) {
      util.array.pushUnique(shipTypes, 'basestar')
    }
    else {
      util.array.pushUnique(shipTypes, info.card.name)
    }
  }

  if (game.getCenturionNext() && !shipTypes.includes('heavy raider')) {
    shipTypes.push('heavy raider')
  }

  shipTypes.sort()

  if (shipTypes.includes('basestar')) {
    shipTypes.push({
      name: 'Launch',
      description: 'Launch two raiders and one heavy raider from each basestar',
    })
  }

  return context.wait({
    actor: context.data.playerName,
    name: 'Choose Cylon Ships to Activate',
    options: shipTypes,
  })
}

function _chooseActivationResp(context) {
  const game = context.state
  const choice = bsgutil.optionName(context.response.option[0])

  if (choice === 'Launch') {
    game.mLog({ template: 'Launching from basestars' })
    game.aBasestarsLaunch('raider', 2)
    game.aBasestarsLaunch('heavy raider', 1)
  }
  else if (choice === 'raider') {
    game.aActivateCylonShips('Raiders')
  }
  else if (choice === 'heavy raider') {
    game.aActivateCylonShips('Hvy Raiders')
  }
  else if (choice === 'basestar') {
    game.aActivateCylonShips('Basestar Attacks')
  }
  else {
    throw new Error(`Unhandled activation type: ${choice}`)
  }
}
