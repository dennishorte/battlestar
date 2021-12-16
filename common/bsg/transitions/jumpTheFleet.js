const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  data: {
    initialDistance: -1,
  },
  steps: [
    {
      name: 'victoryCheck',
      func: _victoryCheck,
    },
    {
      name: 'populationLoss',
      func: _populationLoss,
    },
    {
      name: 'removeShips',
      func: _removeShips
    },
    {
      name: 'chooseDestination',
      func: _chooseDestination,
      resp: _chooseDestinationResp,
    },
    {
      name: 'kobol',
      func: _kobol,
    },
    {
      name: 'resetJumpTrack',
      func: _resetJumpTrack
    },
  ]
})

function _victoryCheck(context) {
  const game = context.state
  game.rk.put(context.data, 'initialDistance', game.getCounterByName('distance'))

  // Check if this is the victory jump
  if (game.getCounterByName('distance') >= 8) {
    throw new bsgutil.GameOverTrigger(
      'The human fleet has reached Kobol and safety.',
      'humans',
    )
  }
}

function _populationLoss(context) {
  const game = context.state
  const jumpTrack = game.getCounterByName('jumpTrack')

  // Check if any population is lost
  if (jumpTrack === 2 || jumpTrack === 3) {
    const dieRoll = bsgutil.rollDie()
    if (dieRoll <= 6) {
      const amount = jumpTrack === 2 ? 3 : 1
      game.mLog({
        template: 'Not all of the civilian ships were ready to jump. {amount} {counter} lost.',
        args: {
          amount,
          counter: 'population',
        }
      })
      game.mAdjustCounterByName('population', -amount)
    }
  }
}

function _removeShips(context) {
  const game = context.state
  game.aClearSpace()
}

function _chooseDestination(context) {
  const game = context.state
  const missionSpecialist = _getMissionSpecialist(game)

  let actor = game.getPlayerAdmiral()
  let count = 2

  if (missionSpecialist) {
    actor = missionSpecialist
    count = 3
    game.mLog({
      template: 'Mission Specialist {player} will choose a destination',
      args: {
        player: actor.name
      }
    })
  }

  // Move destination cards to the player's hand for viewing
  for (let i = 0; i < count; i++) {
    game.mDrawDestinationCard(actor)
  }

  const destinationOptions = game.getCardsKindByPlayer('destination', actor)
  util.assert(destinationOptions.length === count)

  return context.wait({
    actor: actor.name,
    name: 'Choose Destination',
    options: destinationOptions.map(o => ({
      name: o.id,
      description: o.text
    }))
  })
}

function _chooseDestinationResp(context) {
  const game = context.state
  const destinationId =  bsgutil.optionName(context.response.option[0])
  const destination = game.getCardById(destinationId)

  // Mission Specialist's work is done after picking a destination
  const missionSpecialist = _getMissionSpecialist(game)
  if (missionSpecialist) {
    game.mSetPlayerFlag(missionSpecialist, 'isMissionSpecialist', false)
  }

  return context.push('evaluate-effects', {
    effects: destination.script.effects
  })
}

function _getMissionSpecialist(game) {
  return game.getPlayerAll().filter(p => game.checkPlayerIsMissionSpecialist(p))[0]
}

function _kobol(context) {
  const game = context.state
  const becameFour = (
    game.getCounterByName('distance') >= 4
    && context.data.initialDistance < 4
  )

  console.log('hello', game.getCounterByName('distance'), context.data.initialDistance)

  if (becameFour) {
    game.aSleeperAgents()
  }
}

function _resetJumpTrack(context) {
  const game = context.state
  game.mAdjustCounterByName('jumpTrack', -game.getCounterByName('jumpTrack'))
}
