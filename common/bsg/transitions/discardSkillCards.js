const { transitionFactory } = require('./factory.js')
const util = require('../../lib/util.js')


module.exports = transitionFactory(
  {
    responded: [],
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const countsByPlayer = context
    .data
    .countsByPlayer
    .filter(c => !context.data.responded.includes(c.player))

  const waits = countsByPlayer.map(info => _generateOptionsForPlayer(game, info))
  return context.waitMany(waits)
}

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.response.actor)
  const playerSkillCards = game.getCardsKindByPlayer('skill', player)
  const { playerNames, responded } = context.data

  const selected = context.response.option
  util.assert(Array.isArray(selected), "Discard choices should be in an array")

  const cards = playerSkillCards.filter(c => selected.includes(c.id))
  util.assert(cards.length === selected.length, "Couldn't find all the submitted cards")

  game.aDiscardSkillCards(player, cards)
  game.rk.push(responded, player.name)

  const allPlayersHaveDiscarded = responded.length === playerNames.length
  if (allPlayersHaveDiscarded) {
    return context.done()
  }
  else {
    return this.generateOptions(context)
  }
}

function _generateOptionsForPlayer(game, info) {
  const playerSkillCards = game.getCardsKindByPlayer('skill', info.player)
  return {
    actor: info.player,
    actions: [{
      name: 'Discard Skill Cards',
      count: info.count,
      options: playerSkillCards.map(c => c.id)
    }]
  }
}
