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
  const { playerNames, count } = context.data
  const players = playerNames
    .filter(n => !context.data.responded.includes(n))
    .map(n => game.getPlayerByName(n))

  return context.waitMany(
    players.map(p => _generateOptionsForPlayer(game, p, count))
  )
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

function _generateOptionsForPlayer(game, player, count) {
  const playerSkillCards = game.getCardsKindByPlayer('skill', player)
  return {
    actor: player.name,
    actions: [{
      name: 'Discard Skill Cards',
      count,
      options: playerSkillCards.map(c => c.id)
    }]
  }
}
