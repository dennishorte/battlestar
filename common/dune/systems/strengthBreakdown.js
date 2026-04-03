const constants = require('../res/constants.js')

/**
 * Add a strength contribution for a player, incrementing both the counter
 * and the breakdown array.
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
  player.incrementCounter('strength', amount, { silent: true })

  if (!game.state.conflict.strengthBreakdown[player.name]) {
    game.state.conflict.strengthBreakdown[player.name] = []
  }
  game.state.conflict.strengthBreakdown[player.name].push({ source, label, amount })
}

/**
 * Set the initial strength from troops, sandworms, and reveal swords.
 * Creates breakdown entries for each component.
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
  let swordStr = 0
  for (const s of swordSources) {
    swordStr += s.swords * constants.SWORD_STRENGTH
  }
  const total = troopStr + sandwormStr + swordStr

  player.setCounter('strength', total, { silent: true })

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
      breakdown.push({ source: 'card', label: s.label, amount: s.swords * constants.SWORD_STRENGTH })
    }
  }

  return total
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
