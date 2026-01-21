/**
 * QueryMixin - Read-only game state queries for Innovation
 *
 * This mixin provides methods for querying game state without modifying it.
 * Includes checks (boolean queries) and getters (value queries).
 *
 * Note: Achievement-related queries are in AchievementMixin.
 *
 * Usage: Object.assign(Innovation.prototype, QueryMixin)
 */

const util = require('../lib/util.js')

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
   * Check if a player's color stack is splayed.
   */
  checkColorIsSplayed(player, color) {
    return this.zones.byPlayer(player, color).splay !== 'none'
  },

  /**
   * Check if this is the player's first base draw.
   */
  checkIsFirstBaseDraw(player) {
    return !this.state.drawInfo[player.name].drewFirstBaseCard
  },

  /**
   * Check if a player meets the score requirement for an achievement.
   */
  checkScoreRequirement(player, card, opts = {}) {
    return this.getScoreCost(player, card) <= this.getScore(player, opts)
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
   * Get distinct ages of cards in a player's zone.
   */
  getAgesByZone(player, zoneName) {
    const ages = this.cards.byPlayer(player, zoneName).map(c => c.getAge())
    return util.array.distinct(ages).sort()
  },

  /**
   * Get ages that have cards remaining in their decks.
   */
  getNonEmptyAges() {
    return this.getAges()
      .filter(age => this.zones.byDeck('base', age).cardlist().length > 0)
  },

  /**
   * Get the highest age among a player's top cards.
   */
  getHighestTopAge(player, opts = {}) {
    const card = this.getHighestTopCard(player)
    const baseAge = card ? card.getAge() : 0

    const karmaAdjustment = this
      .findKarmasByTrigger(player, 'add-highest-top-age')
      .filter(info => info.impl.reason !== undefined)
      .filter(info => info.impl.reason === 'all' || info.impl.reason === opts.reason)
      .reduce((l, r) => l + r.impl.func(this, player), 0)

    return baseAge + karmaAdjustment
  },

  /**
   * Get the highest top card for a player.
   */
  getHighestTopCard(player) {
    return this.util.highestCards(this.cards.tops(player), { visible: true })[0]
  },

  // ---------------------------------------------------------------------------
  // Score-related getters
  // ---------------------------------------------------------------------------

  /**
   * Get a player's total score.
   */
  getScore(player, opts = {}) {
    return this.getScoreDetails(player, opts).total * (opts.doubleScore ? 2 : 1)
  },

  /**
   * Get detailed breakdown of a player's score.
   */
  getScoreDetails(player, opts = {}) {
    const details = {
      score: [],
      bonuses: [],
      karma: [],
      scorePoints: 0,
      bonusPoints: 0,
      karmaPoints: 0,
      total: 0
    }

    details.score = this.cards
      .byPlayer(player, 'score')
      .filter(card => !opts.excludeCards || opts.excludeCards.findIndex(x => x.id !== card.id) === -1)
      .map(card => card.getAge())
      .sort()

    details.bonuses = this.getBonuses(player)

    details.karma = this
      .findKarmasByTrigger(player, 'calculate-score')
      .map(info => ({ name: info.card.name, points: this.executeEffect(player, info) }))

    details.scorePoints = details.score.reduce((l, r) => l + r, 0)
    details.bonusPoints = (details.bonuses[0] || 0) + Math.max(details.bonuses.length - 1, 0)
    details.karmaPoints = details.karma.reduce((l, r) => l + r.points, 0)
    details.total = details.scorePoints + details.bonusPoints + details.karmaPoints

    return details
  },

  /**
   * Get a player's bonuses from cards.
   */
  getBonuses(player) {
    const bonuses = this.util
      .colors()
      .flatMap(color => this.zones.byPlayer(player, color))
      .flatMap(zone => zone.cardlist().flatMap(card => card.getBonuses()))

    const karmaBonuses = this
      .findKarmasByTrigger(player, 'list-bonuses')
      .flatMap(info => info.impl.func(this, player))

    return bonuses
      .concat(karmaBonuses)
      .sort((l, r) => r - l)
  },

  /**
   * Get the score cost to achieve a card.
   */
  getScoreCost(player, card) {
    const sameAge = this.zones
      .byPlayer(player, 'achievements')
      .cardlist()
      .filter(c => c.getAge() === card.getAge())

    const karmaAdjustment = this
      .findKarmasByTrigger(player, 'achievement-cost-discount')
      .map(info => info.impl.func(this, player, { card }))
      .reduce((l, r) => l + r, 0)

    return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
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
  // Zone-related getters
  // ---------------------------------------------------------------------------

  /**
   * Get a player's splayed color zones.
   */
  getSplayedZones(player) {
    return this.util
      .colors()
      .map(color => this.zones.byPlayer(player, color))
      .filter(zone => zone.splay !== 'none')
  },

  /**
   * Get all color zones for a player.
   */
  getColorZonesByPlayer(player) {
    return this.util
      .colors()
      .map(color => this.zones.byPlayer(player, color))
  },

  /**
   * Get the number of open safe slots for a player.
   */
  getSafeOpenings(player) {
    return Math.max(0, this.getSafeLimit(player) - this.cards.byPlayer(player, 'safe').length)
  },

  /**
   * Get the safe card limit for a player.
   */
  getSafeLimit(player) {
    return this.getZoneLimit(player)
  },

  /**
   * Get the forecast card limit for a player.
   */
  getForecastLimit(player) {
    return this.getZoneLimit(player)
  },

  /**
   * Get the zone limit based on player's splays.
   */
  getZoneLimit(player) {
    const splays = this.util
      .colors()
      .map(color => this.zones.byPlayer(player, color).splay)

    if (splays.includes('aslant')) {
      return 1
    }
    else if (splays.includes('up')) {
      return 2
    }
    else if (splays.includes('right')) {
      return 3
    }
    else if (splays.includes('left')) {
      return 4
    }
    else {
      return 5
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
