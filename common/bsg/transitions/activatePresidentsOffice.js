const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')
const { evaluateEffects } = require('./util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (!game.checkPlayerIsPresident(player)) {
    game.mLog({
      template: "{player} is not the President, so can't use the President's Office",
      args: {
        player: player.name
      }
    })
    return context.done()
  }

  game.aDrawQuorumCard()

  return context.wait({
    actor: player.name,
    name: 'Play or Draw',
    options: [
      'Draw a Quorum Card',
      {
        name: 'Play a Quorum Card',
        options: game.getCardsKindByPlayer('quorum', player).map(c => c.id)
      }
    ]
  })
}

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const optionName = bsgutil.optionName(context.response.option[0])

  if (optionName === 'Play a Quorum Card') {
    const cardId = context.response.option[0].option[0]
    markDone(context)
    return context.push('play-quorum-card', {
      playerName: player.name,
      cardId,
    })
  }

  else if (optionName === 'Draw a Quorum Card') {
    game.aDrawQuorumCard()
    return context.done()
  }

  else {
    throw new Error(`Unknown option: ${option}`)
  }
}
