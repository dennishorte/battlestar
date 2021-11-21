const { transitionFactory, markDone } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const missionSpecialist = _getMissionSpecialist(game)
  const actor = missionSpecialist ? missionSpecialist : game.getPlayerAdmiral()
  const count = missionSpecialist ? 3 : 2

  if (missionSpecialist) {
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
    actions: [{
      name: 'Choose Destination',
      options: destinationOptions.map(o => ({
        name: o.id,
        description: o.text
      }))
    }]
  })
}

function handleResponse(context) {
  const game = context.state
  const destinationId = context.response.option[0]
  const destination = game.getCardById(destinationId)

  markDone(context)
  return context.push('evaluate-effects', destination.script.effects)
}

function _getMissionSpecialist(game) {
  return game.getPlayerAll().filter(p => p.isMissionSpecialist)[0]
}
