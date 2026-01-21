/**
 * Determines if branchId should update based on waiting state changes.
 * branchId should only update when the game reaches a "checkpoint" where
 * previous pending responses might become invalid.
 *
 * @param {Object|null} previousWaiting - Previous waiting state { players: string[], concurrent: boolean }
 * @param {Object|null} currentWaiting - Current waiting state { players: string[], concurrent: boolean }
 * @returns {boolean} - Whether branchId should be updated
 */
export function shouldUpdateBranchId(previousWaiting, currentWaiting) {
  // No previous state (first save or old game) - always update
  if (!previousWaiting) {
    return true
  }

  // Game is over or no longer waiting for input - checkpoint reached
  if (!currentWaiting) {
    return true
  }

  // If previous state was concurrent (e.g., drafting), only update if
  // we've left the concurrent phase entirely
  if (previousWaiting.concurrent) {
    // Stay in same branch as long as we're still in concurrent mode
    // This allows multiple players to submit without conflicts
    return !currentWaiting.concurrent
  }

  // For non-concurrent (sequential/simultaneous) requests:
  // Update only if new players appeared who weren't previously waiting
  // (Players being removed means we're still collecting responses)
  const prevPlayers = new Set(previousWaiting.players || [])
  const currPlayers = new Set(currentWaiting.players || [])

  // Check if any new players were added
  for (const player of currPlayers) {
    if (!prevPlayers.has(player)) {
      return true  // New player added - game advanced to new state
    }
  }

  // Current players are a subset of previous - still collecting
  return false
}
