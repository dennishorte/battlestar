const { transitionFactory, markDone } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const characterDeck = game.getZoneByName('decks.character')
  const availableCharacters = characterDeck.cards.map(c => c.id).sort()

  return context.wait({
    actor: player.name,
    name: 'Select Character',
    options: availableCharacters,
  })
}

function handleResponse(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const characterId = context.response.option[0]
  const characterCard = game.getCardById(characterId)
  game.aSelectCharacter(player, characterCard.name)

  // Apollo still needs to launch in a viper
  if (
    characterCard.name === 'Lee "Apollo" Adama'
    && game.getCardsKindByPlayer('player-token', player).length > 0
  ) {
    markDone(context)
    return context.push('launch-self-in-viper', { playerName: player.name })
  }
  else {
    return context.done()
  }
}
