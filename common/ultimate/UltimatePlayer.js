const { BasePlayer } = require('../lib/game/index.js')
const util = require('../lib/util.js')


class UltimatePlayer extends BasePlayer {

  // ---------------------------------------------------------------------------
  // Biscuit methods
  // ---------------------------------------------------------------------------

  biscuits() {
    const boardBiscuits = this
      .game
      .zones
      .colorStacks(this)
      .map(zone => zone.biscuits())
      .reduce((l, r) => this.game.util.combineBiscuits(l, r))

    return this
      .game
      .findKarmasByTrigger(this, 'calculate-biscuits')
      .map(info => this.game.executeEffect(this, info, { biscuits: boardBiscuits }))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), boardBiscuits)
  }

  biscuitsByColor() {
    const output = {}
    for (const color of this.game.util.colors()) {
      output[color] = this.zones.byPlayer(this, color).biscuits()
    }
    return output
  }

  // ---------------------------------------------------------------------------
  // Card and age methods
  // ---------------------------------------------------------------------------

  /**
   * Get the highest top card for this player.
   */
  highestTopCard() {
    return this.game.util.highestCards(this.game.cards.tops(this), { visible: true })[0]
  }

  /**
   * Get the highest age among this player's top cards.
   */
  highestTopAge(opts = {}) {
    const card = this.highestTopCard()
    const baseAge = card ? card.getAge() : 0

    const karmaAdjustment = this.game
      .findKarmasByTrigger(this, 'add-highest-top-age')
      .filter(info => info.impl.reason !== undefined)
      .filter(info => info.impl.reason === 'all' || info.impl.reason === opts.reason)
      .reduce((l, r) => l + r.impl.func(this.game, this), 0)

    return baseAge + karmaAdjustment
  }

  /**
   * Get distinct ages of cards in a zone.
   */
  agesByZone(zoneName) {
    const ages = this.game.cards.byPlayer(this, zoneName).map(c => c.getAge())
    return util.array.distinct(ages).sort()
  }

  // ---------------------------------------------------------------------------
  // Score methods
  // ---------------------------------------------------------------------------

  /**
   * Get this player's total score.
   */
  score(opts = {}) {
    return this.scoreDetails(opts).total * (opts.doubleScore ? 2 : 1)
  }

  /**
   * Get detailed breakdown of this player's score.
   */
  scoreDetails(opts = {}) {
    const details = {
      score: [],
      bonuses: [],
      karma: [],
      scorePoints: 0,
      bonusPoints: 0,
      karmaPoints: 0,
      total: 0
    }

    details.score = this.game.cards
      .byPlayer(this, 'score')
      .filter(card => !opts.excludeCards || opts.excludeCards.findIndex(x => x.id !== card.id) === -1)
      .map(card => card.getAge())
      .sort()

    details.bonuses = this.bonuses()

    details.karma = this.game
      .findKarmasByTrigger(this, 'calculate-score')
      .map(info => ({ name: info.card.name, points: this.game.executeEffect(this, info) }))

    details.scorePoints = details.score.reduce((l, r) => l + r, 0)
    details.bonusPoints = (details.bonuses[0] || 0) + Math.max(details.bonuses.length - 1, 0)
    details.karmaPoints = details.karma.reduce((l, r) => l + r.points, 0)
    details.total = details.scorePoints + details.bonusPoints + details.karmaPoints

    return details
  }

  /**
   * Get this player's bonuses from cards.
   */
  bonuses() {
    const bonuses = this.game.util
      .colors()
      .flatMap(color => this.game.zones.byPlayer(this, color))
      .flatMap(zone => zone.cardlist().flatMap(card => card.getBonuses()))

    const karmaBonuses = this.game
      .findKarmasByTrigger(this, 'list-bonuses')
      .flatMap(info => info.impl.func(this.game, this))

    return bonuses
      .concat(karmaBonuses)
      .sort((l, r) => r - l)
  }

  /**
   * Get the score cost for this player to achieve a card.
   */
  scoreCost(card) {
    const sameAge = this.game.zones
      .byPlayer(this, 'achievements')
      .cardlist()
      .filter(c => c.getAge() === card.getAge())

    const karmaAdjustment = this.game
      .findKarmasByTrigger(this, 'achievement-cost-discount')
      .map(info => info.impl.func(this.game, this, { card }))
      .reduce((l, r) => l + r, 0)

    return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
  }

  /**
   * Check if this player meets the score requirement for an achievement.
   */
  meetsScoreRequirement(card, opts = {}) {
    return this.scoreCost(card) <= this.score(opts)
  }

  // ---------------------------------------------------------------------------
  // Zone methods
  // ---------------------------------------------------------------------------

  /**
   * Check if a color stack is splayed.
   */
  isColorSplayed(color) {
    return this.game.zones.byPlayer(this, color).splay !== 'none'
  }

  /**
   * Get this player's splayed color zones.
   */
  splayedZones() {
    return this.game.util
      .colors()
      .map(color => this.game.zones.byPlayer(this, color))
      .filter(zone => zone.splay !== 'none')
  }

  /**
   * Get all color zones for this player.
   */
  colorZones() {
    return this.game.util
      .colors()
      .map(color => this.game.zones.byPlayer(this, color))
  }

  /**
   * Get the zone limit based on this player's splays.
   */
  zoneLimit() {
    const splays = this.game.util
      .colors()
      .map(color => this.game.zones.byPlayer(this, color).splay)

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
  }

  /**
   * Get the safe card limit for this player.
   */
  safeLimit() {
    return this.zoneLimit()
  }

  /**
   * Get the forecast card limit for this player.
   */
  forecastLimit() {
    return this.zoneLimit()
  }

  /**
   * Get the number of open safe slots for this player.
   */
  safeOpenings() {
    return Math.max(0, this.safeLimit() - this.game.cards.byPlayer(this, 'safe').length)
  }

  // ---------------------------------------------------------------------------
  // Other checks
  // ---------------------------------------------------------------------------

  /**
   * Check if this is the player's first base draw.
   */
  isFirstBaseDraw() {
    return !this.game.state.drawInfo[this.name].drewFirstBaseCard
  }
}

module.exports = {
  UltimatePlayer,
}
