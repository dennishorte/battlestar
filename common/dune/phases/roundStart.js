const deckEngine = require('../systems/deckEngine.js')
const deploy = require('../systems/deploy.js')
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
  // Clear previous conflict card
  const conflictDiscard = game.zones.byId('common.conflictDiscard')
  for (const old of conflictActive.cardlist()) {
    old.moveTo(conflictDiscard)
  }
  let revealedCard = null
  const conflictCards = conflictDeck.cardlist()
  if (conflictCards.length > 0) {
    const card = conflictCards[0]
    card.moveTo(conflictActive)
    game.state.conflict.cardId = card.id
    game.state.conflict.currentCard = card.definition || card
    revealedCard = card
    game.log.add({
      template: 'Conflict card revealed: {card}',
      args: { card },
      event: 'step',
    })
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

  // Defensive bonus: controller of the conflict's location may deploy 1 troop
  // from supply directly to the Conflict (rules.txt:314). Resolved after combat
  // state reset so the deployed troop persists.
  if (revealedCard) {
    const location = revealedCard.definition?.location
    if (location && game.state.controlMarkers[location]) {
      const controllerName = game.state.controlMarkers[location]
      const controller = game.players.byName(controllerName)
      if (controller && controller.troopsInSupply > 0) {
        const [choice] = game.actions.choose(controller, ['Deploy', 'Decline'], {
          title: `Defensive bonus (${location}): deploy 1 troop from supply to Conflict?`,
        })
        if (choice === 'Deploy') {
          controller.decrementCounter('troopsInSupply', 1, { silent: true })
          deploy.deployToConflict(game, controller, 1)
          game.log.add({
            template: '{player} deploys 1 troop to Conflict (defensive bonus for {location})',
            args: { player: controller, location },
          })
        }
      }
    }
  }
}

module.exports = { roundStartPhase }
