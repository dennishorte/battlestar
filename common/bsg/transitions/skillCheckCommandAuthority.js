const { transitionFactory } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerWithCard('William Adama')

  util.assert(player !== undefined, 'No player is William Adama')
  util.assert(!player.oncePerGameUsed, 'William Adama has already used his once-per-game ability')

  return context.wait({
    actor: player.name,
    actions: [{
      name: 'Use Command Authority',
      description: 'Take all cards from the crisis pool into your hand?',
      options: ['Yes', 'No']
    }]
  })
}

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerWithCard('William Adama')
  const option = context.response.option[0]

  if (option === 'Yes') {
    const crisisPool = game.getZoneByName('crisisPool')
    const playerHand = game.getZoneByPlayer(player)

    game.mLog({ template: 'William Adama uses Command Authority' })
    game.rk.put(player, 'oncePerGameUsed', true)
    while (crisisPool.cards.length > 0) {
      game.mMoveCard(crisisPool, playerHand)
    }
  }
  else {
    game.mLog({ template: 'William Adama chooses not to use Command Authority' })
  }

  return context.done()
}
