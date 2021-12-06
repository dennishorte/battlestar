const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'playCard',
      func: _playCard,
    },
  ],
})


function _playCard(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const card = game.getCardById(context.data.cardId)

  game.mRevealCard(card)
  game.mLog({
    template: '{player} plays quorum card {card}',
    args: {
      player: player.name,
      card,
    }
  })

  if (card.name === 'Accept Prophecy') {
    game.mKeep(card)
    return context.push('draw-skill-cards', {
      playerName: player.name,
      reason: 'Accept Prophecy'
    })
  }

  else if (card.name === 'Arrest Order') {
    game.mDiscard(card)
    return context.push('send-player-to', {
      playerName: player.name,
      location: 'Brig',
      reason: 'Arrest Order',
    })
  }

  else if (card.name === 'Assign Arbitrator') {
    game.aDrawSkillCards(player, ['politics', 'politics'])
    return context.push('assign-arbitrator', {
      playerName: player.name
    })
  }

  else if (card.name === 'Assign Mission Specialist') {
    game.aDrawSkillCards(player, ['politics', 'politics'])
    return context.push('assign-mission-specialist', {
      playerName: player.name
    })
  }

  else if (card.name === 'Assign Vice President') {
    game.aDrawSkillCards(player, ['politics', 'politics'])
    return context.push('assign-vice-president', {
      playerName: player.name
    })
  }

  else {
    throw new Error(`Unsupported quorum card: ${card.name}`)
  }
}
