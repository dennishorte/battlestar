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
    const card = conflictCards[0]
    card.moveTo(conflictActive)
    game.state.conflict.cardId = card.id
    game.state.conflict.currentCard = card.definition || card
    game.log.add({
      template: 'Conflict card revealed: {card}',
      args: { card: card.name },
      event: 'step',
    })

    // Defensive bonus: controller of the conflict's location deploys 1 troop
    const location = card.definition?.location
    if (location && game.state.controlMarkers[location]) {
      const controllerName = game.state.controlMarkers[location]
      const controller = game.players.byName(controllerName)
      if (controller && controller.troopsInSupply > 0) {
        controller.decrementCounter('troopsInSupply', 1, { silent: true })
        controller.incrementCounter('troopsInGarrison', 1, { silent: true })
        game.log.add({
          template: '{player} deploys 1 troop (defensive bonus for {location})',
          args: { player: controller, location },
        })
      }
    }
  }

  // Each player draws 5 cards
  for (const player of game.players.all()) {
    deckEngine.drawCards(game, player, constants.HAND_SIZE)
  }

  // Reset combat state for the round
  const { resetBreakdown } = require('../systems/strengthBreakdown.js')
  game.state.conflict.deployedTroops = {}
  game.state.conflict.deployedSandworms = {}
  resetBreakdown(game)
  for (const player of game.players.all()) {
    game.state.conflict.deployedTroops[player.name] = 0
    game.state.conflict.deployedSandworms[player.name] = 0
    player.setCounter('strength', 0, { silent: true })
  }
}

module.exports = { roundStartPhase }
