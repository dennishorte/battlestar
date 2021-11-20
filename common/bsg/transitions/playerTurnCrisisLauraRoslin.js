const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')


module.exports = transitionFactory(
  {
    cardsDrawn: false
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerWithCard('Laura Roslin')

  // Draw the two cards to choose from
  if (!context.data.cardsDrawn) {
    game.mMoveCard('decks.crisis', game.getZoneByPlayer(player))
    game.mMoveCard('decks.crisis', game.getZoneByPlayer(player))
    game.rk.put(context.data, 'cardsDrawn', true)
  }

  const cardChoices = game.getCardsKindByPlayer('crisis', player)
  const playerOptions = cardChoices.map(card => card.id)
  return context.wait({
    actor: player.name,
    actions: [{
      name: 'Religious Visions',
      description: 'Choose a crisis card to evaluate',
      options: playerOptions,
    }]
  })
}

function handleResponse(context) {
  const game = context.state

  const player = game.getPlayerWithCard('Laura Roslin')
  const playerZone = game.getZoneByPlayer(player)

  const cardChoices = game.getCardsKindByPlayer('crisis', player)
  util.assert(cardChoices.length === 2, "Player should have exactly two cards to choose from")

  const chosenCardId = bsgutil.optionName(context.response.option[0])
  const chosenCard = cardChoices.find(c => c.id === chosenCardId)
  const otherCard = cardChoices.find(c => c.id !== chosenCardId)

  game.mDiscard(otherCard)
  game.mMoveCard(playerZone, 'keep', chosenCard)
  game.mSetCrisisActive(chosenCard)

  return context.done()
}
