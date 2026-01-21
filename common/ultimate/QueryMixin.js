/**
 * QueryMixin - Read-only game state queries for Innovation
 *
 * This mixin provides game-level queries that don't belong on a specific player.
 * Player-specific queries are on the UltimatePlayer class.
 *
 * Note: Achievement-related queries are in AchievementMixin.
 *
 * Usage: Object.assign(Innovation.prototype, QueryMixin)
 */

const QueryMixin = {

  // ---------------------------------------------------------------------------
  // Check methods (boolean queries)
  // ---------------------------------------------------------------------------

  /**
   * Check if age zero cards are in play.
   */
  checkAgeZeroInPlay() {
    return false
  },

  /**
   * Check if a zone has visible dogma or echo effects.
   */
  checkZoneHasVisibleDogmaOrEcho(player, zone) {
    return (
      this.getVisibleEffectsByColor(player, zone.color, 'dogma').length > 0
      || this.getVisibleEffectsByColor(player, zone.color, 'echo').length > 0
    )
  },

  // ---------------------------------------------------------------------------
  // Age-related getters
  // ---------------------------------------------------------------------------

  /**
   * Get the list of valid ages in the game.
   */
  getAges() {
    if (this.state.useAgeZero) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
    else {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
  },

  /**
   * Get the minimum age in the game.
   */
  getMinAge() {
    return this.getAges()[0]
  },

  /**
   * Get the maximum age in the game.
   */
  getMaxAge() {
    return this.getAges().slice(-1)[0]
  },

  /**
   * Get ages that have cards remaining in their decks.
   */
  getNonEmptyAges() {
    return this.getAges()
      .filter(age => this.zones.byDeck('base', age).cardlist().length > 0)
  },

  // ---------------------------------------------------------------------------
  // Biscuit-related getters
  // ---------------------------------------------------------------------------

  /**
   * Get biscuit counts for all players.
   */
  getBiscuits() {
    const biscuits = this.players
      .all()
      .map(player => [player.name, player.biscuits()])
    return Object.fromEntries(biscuits)
  },

  /**
   * Get the unique player with the most of a specific biscuit type.
   * Returns undefined if tied or no one has any.
   */
  getUniquePlayerWithMostBiscuits(biscuit) {
    const biscuits = this.getBiscuits()

    let most = 0
    let mostPlayerNames = []
    for (const [playerName, bis] of Object.entries(biscuits)) {
      const count = bis[biscuit]
      if (count > most) {
        most = count
        mostPlayerNames = [playerName]
      }
      else if (count === most) {
        mostPlayerNames.push(playerName)
      }
    }

    if (most > 0 && mostPlayerNames.length === 1) {
      return this.players.byName(mostPlayerNames[0])
    }
  },

  // ---------------------------------------------------------------------------
  // Other getters
  // ---------------------------------------------------------------------------

  /**
   * Get the list of expansions in use.
   */
  getExpansionList() {
    return this.settings.expansions
  },
}

module.exports = {
  QueryMixin,
}
