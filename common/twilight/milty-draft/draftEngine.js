/**
 * Pure functions for Milty Draft snake-draft logic.
 * All functions operate on a draft state object stored in game.state.miltyDraft.
 */

/**
 * Build snake draft order for N players across 3 rounds.
 * Round 1: P1..PN, Round 2: PN..P1, Round 3: P1..PN
 *
 * @param {string[]} names - Player names in seat order
 * @returns {string[]} - Draft order (3N entries)
 */
function buildDraftOrder(names) {
  return [
    ...names,
    ...[...names].reverse(),
    ...names,
  ]
}

/**
 * Create initial draft state.
 *
 * @param {Object} params
 * @param {Array} params.slices - Generated slices from sliceGenerator
 * @param {string[]} params.factionPool - Available faction IDs
 * @param {string[]} params.playerNames - Player names in seat order
 * @returns {Object} Draft state
 */
function createDraftState({ slices, factionPool, playerNames }) {
  const positions = playerNames.map((_, i) => i + 1)
  const playerState = {}
  for (const name of playerNames) {
    playerState[name] = { faction: null, slice: null, position: null }
  }

  return {
    slices,
    factionPool,
    positions,
    picks: [],
    playerState,
    draftOrder: buildDraftOrder(playerNames),
    currentPickIndex: 0,
  }
}

/**
 * Get the name of the player who picks next.
 */
function getCurrentPlayer(state) {
  return state.draftOrder[state.currentPickIndex]
}

/**
 * Get categories this player hasn't picked yet.
 */
function getAvailableCategories(state, name) {
  const ps = state.playerState[name]
  const categories = []
  if (ps.slice === null) {
    categories.push('slice')
  }
  if (ps.faction === null) {
    categories.push('faction')
  }
  if (ps.position === null) {
    categories.push('position')
  }
  return categories
}

/**
 * Get unpicked options for a category.
 */
function getAvailableOptions(state, category) {
  const taken = new Set()

  for (const ps of Object.values(state.playerState)) {
    if (ps[category] !== null) {
      taken.add(ps[category])
    }
  }

  if (category === 'slice') {
    return state.slices
      .map((_, i) => i)
      .filter(i => !taken.has(i))
  }
  if (category === 'faction') {
    return state.factionPool.filter(f => !taken.has(f))
  }
  if (category === 'position') {
    return state.positions.filter(p => !taken.has(p))
  }
  return []
}

/**
 * Apply a pick to the draft state. Mutates state.
 *
 * @param {Object} state - Draft state
 * @param {string} name - Player name
 * @param {string} category - 'faction' | 'slice' | 'position'
 * @param {*} value - The chosen value
 */
function applyPick(state, name, category, value) {
  if (getCurrentPlayer(state) !== name) {
    throw new Error(`Not ${name}'s turn to pick`)
  }

  const available = getAvailableCategories(state, name)
  if (!available.includes(category)) {
    throw new Error(`${name} already picked ${category}`)
  }

  const options = getAvailableOptions(state, category)
  if (!options.includes(value)) {
    throw new Error(`${value} is not available for ${category}`)
  }

  state.playerState[name][category] = value
  state.picks.push({ player: name, category, value })
  state.currentPickIndex++
}

/**
 * Check if all players have picked all 3 categories.
 */
function isDraftComplete(state) {
  return state.currentPickIndex >= state.draftOrder.length
}

module.exports = {
  buildDraftOrder,
  createDraftState,
  getCurrentPlayer,
  getAvailableCategories,
  getAvailableOptions,
  applyPick,
  isDraftComplete,
}
