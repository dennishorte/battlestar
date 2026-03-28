const deckEngine = require('../systems/deckEngine.js')
const constants = require('../res/constants.js')

/**
 * Phase 1: Round Start
 * - Reveal a new Conflict card
 * - Each player draws 5 cards
 */
function roundStartPhase(game) {
  game.state.phase = 'round-start'
  game.log.add({ template: 'Round Start', event: 'phase-start' })

  // Reveal conflict card
  const conflictDeck = game.zones.byId('common.conflictDeck')
  const conflictActive = game.zones.byId('common.conflictActive')
  const conflictCards = conflictDeck.cardlist()
  if (conflictCards.length > 0) {
    conflictCards[0].moveTo(conflictActive)
    game.state.conflict.cardId = conflictCards[0].id
    game.log.add({
      template: 'Conflict card revealed',
      event: 'step',
    })
  }

  // Each player draws 5 cards
  for (const player of game.players.all()) {
    deckEngine.drawCards(game, player, constants.HAND_SIZE)
  }

  // Reset combat state for the round
  game.state.conflict.deployedTroops = {}
  game.state.conflict.deployedSandworms = {}
  for (const player of game.players.all()) {
    game.state.conflict.deployedTroops[player.name] = 0
    game.state.conflict.deployedSandworms[player.name] = 0
    player.setCounter('strength', 0, { silent: true })
  }
}

module.exports = { roundStartPhase }
