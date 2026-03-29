const constants = require('../res/constants.js')

/**
 * Gain influence with a faction. Handles VP at 2, bonus at 4, and alliance tracking.
 */
function gainInfluence(game, player, faction, amount = 1) {
  const prev = player.getInfluence(faction)
  const next = prev + amount

  player.setInfluence(faction, next)

  game.log.add({
    template: '{player} gains {amount} {faction} Influence ({prev} -> {next})',
    args: { player, amount, faction, prev, next },
  })

  // Check VP threshold at 2
  if (prev < constants.INFLUENCE_VP_THRESHOLD && next >= constants.INFLUENCE_VP_THRESHOLD) {
    player.incrementCounter('vp', 1, { silent: true })
    game.log.add({
      template: '{player} reaches 2 {faction} Influence: +1 Victory Point',
      args: { player, faction },
    })
  }

  // Check bonus at 4
  if (prev < constants.INFLUENCE_BONUS_THRESHOLD && next >= constants.INFLUENCE_BONUS_THRESHOLD) {
    applyFactionBonus(game, player, faction)
  }

  // Check alliance at 4 (first to reach or overtake)
  if (next >= constants.INFLUENCE_BONUS_THRESHOLD) {
    checkAlliance(game, player, faction)
  }
}

/**
 * Lose influence with a faction. Handles VP loss when dropping below 2.
 */
function loseInfluence(game, player, faction, amount = 1) {
  const prev = player.getInfluence(faction)
  const next = Math.max(0, prev - amount)

  player.setInfluence(faction, next)

  game.log.add({
    template: '{player} loses {amount} {faction} Influence ({prev} -> {next})',
    args: { player, amount, faction, prev, next },
  })

  // Lose VP when dropping below 2
  if (prev >= constants.INFLUENCE_VP_THRESHOLD && next < constants.INFLUENCE_VP_THRESHOLD) {
    player.decrementCounter('vp', 1, { silent: true })
    game.log.add({
      template: '{player} drops below 2 {faction} Influence: -1 Victory Point',
      args: { player, faction },
    })
  }
}

/**
 * Apply the bonus for reaching 4 influence with a faction.
 */
function applyFactionBonus(game, player, faction) {
  game.log.add({
    template: '{player} reaches 4 {faction} Influence: bonus!',
    args: { player, faction },
  })

  switch (faction) {
    case 'emperor': {
      // Place a spy
      const spies = require('./spies.js')
      spies.placeSpy(game, player)
      break
    }
    case 'guild':
      // +3 Solari
      player.incrementCounter('solari', 3, { silent: true })
      game.log.add({ template: '{player} gains 3 Solari', args: { player } })
      break
    case 'bene-gesserit': {
      // +1 Intrigue card
      const deckEngine = require('./deckEngine.js')
      deckEngine.drawIntrigueCard(game, player, 1)
      break
    }
    case 'fremen':
      // +1 Water
      player.incrementCounter('water', 1, { silent: true })
      game.log.add({ template: '{player} gains 1 Water', args: { player } })
      break
  }
}

/**
 * Check if a player should receive or steal a faction alliance.
 * First player to 4 gets it. If someone overtakes them, the alliance transfers.
 */
function checkAlliance(game, player, faction) {
  const currentHolder = game.state.alliances[faction]

  if (!currentHolder) {
    // No one has the alliance yet — first to reach 4
    game.state.alliances[faction] = player.name
    player.incrementCounter('vp', 1, { silent: true })
    game.log.add({
      template: '{player} earns the {faction} Alliance: +1 Victory Point',
      args: { player, faction },
    })
    // Check contract completion
    const choam = require('./choam.js')
    choam.checkContractCompletion(game, player, 'earn-alliance', {})
  }
  else if (currentHolder !== player.name) {
    // Someone else has it — check if we overtake them
    const holder = game.players.byName(currentHolder)
    if (player.getInfluence(faction) > holder.getInfluence(faction)) {
      // Steal the alliance
      game.state.alliances[faction] = player.name
      holder.decrementCounter('vp', 1, { silent: true })
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({
        template: '{player} takes the {faction} Alliance from {holder}: VP transfers',
        args: { player, faction, holder },
      })
    }
  }
}

/**
 * Get which player holds an alliance, if any.
 */
function getAllianceHolder(game, faction) {
  return game.state.alliances[faction]
}

module.exports = {
  gainInfluence,
  loseInfluence,
  checkAlliance,
  getAllianceHolder,
}
