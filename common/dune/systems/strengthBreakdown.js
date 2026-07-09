const constants = require('../res/constants.js')

/**
 * Record a strength contribution for a player's Combat-strength breakdown
 * tooltip. `player.strength` is derived (see DunePlayer#strength) from live
 * Conflict state plus this breakdown, so this only needs to log the entry —
 * there's no counter to keep in sync, and no ordering requirement relative
 * to when the player's Reveal Turn happens.
 *
 * @param {object} game
 * @param {object} player
 * @param {string} source - category: 'troops', 'sandworms', 'card', 'intrigue', 'leader'
 * @param {string} label - display name (e.g. card name, "Troops", "Sandworms")
 * @param {number} amount - strength points added
 */
function addStrength(game, player, source, label, amount) {
  if (!amount) {
    return
  }

  if (!game.state.conflict.strengthBreakdown[player.name]) {
    game.state.conflict.strengthBreakdown[player.name] = []
  }
  game.state.conflict.strengthBreakdown[player.name].push({ source, label, amount })
}

/**
 * Record breakdown entries for troops, sandworms, and reveal swords at a
 * player's Reveal Turn. The 'troops'/'sandworms' entries are cosmetic (the
 * tooltip likes an itemized breakdown) — the actual strength value is always
 * computed live from deployedTroops/deployedSandworms, not from these.
 *
 * @param {object} game
 * @param {object} player
 * @param {Array} swordSources - [{ label, swords }] per-card sword contributions
 */
function setRevealStrength(game, player, swordSources) {
  const troops = game.state.conflict.deployedTroops[player.name] || 0
  const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
  const hasUnits = (troops + sandworms) > 0

  if (!hasUnits) {
    return 0
  }

  const troopStr = troops * constants.TROOP_STRENGTH
  const sandwormStr = sandworms * constants.SANDWORM_STRENGTH

  if (!game.state.conflict.strengthBreakdown[player.name]) {
    game.state.conflict.strengthBreakdown[player.name] = []
  }
  const breakdown = game.state.conflict.strengthBreakdown[player.name]

  if (troopStr > 0) {
    breakdown.push({ source: 'troops', label: `${troops} Troop${troops > 1 ? 's' : ''}`, amount: troopStr })
  }
  if (sandwormStr > 0) {
    breakdown.push({ source: 'sandworms', label: `${sandworms} Sandworm${sandworms > 1 ? 's' : ''}`, amount: sandwormStr })
  }
  for (const s of swordSources) {
    if (s.swords > 0) {
      addStrength(game, player, 'card', s.label, s.swords * constants.SWORD_STRENGTH)
    }
  }

  return player.strength
}

/**
 * Reset the breakdown for all players.
 */
function resetBreakdown(game) {
  game.state.conflict.strengthBreakdown = {}
}

module.exports = {
  addStrength,
  setRevealStrength,
  resetBreakdown,
}
