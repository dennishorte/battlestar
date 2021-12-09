const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initialize',
      func: _initialize,
    },
    {
      name: 'execute',
      func: _execute,
      resp: _executeDo,
    },
  ],
})

function _initialize(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  game.mSetOncePerGameAbilityUsed(player)
}

function _execute(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (character.name === 'Gaius Baltar') {
    const otherPlayers = game
      .getPlayerAll()
      .filter(p => p.name !== player.name)
      .map(p => p.name)

    return context.wait({
      actor: player.name,
      name: 'Cylon Detector',
      description: 'View all loyalty cards of selected player',
      options: otherPlayers
    })
  }
}

function _executeDo(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (character.name === 'Gaius Baltar') {
    const targetName = bsgutil.optionName(context.response.option[0])
    const target = game.getPlayerByName(targetName)
    game.mLog({
      template: "{player1} uses Gaius Baltar's Cylon Detector ability on {player2}",
      args: {
        player1: player.name,
        player2: target.name,
      }
    })
    game.aRevealLoyaltyCards(target, player, 999)
  }
}
