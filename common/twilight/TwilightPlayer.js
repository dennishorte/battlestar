const { BasePlayer } = require('../lib/game/index.js')
const res = require('./res/index.js')


class TwilightPlayer extends BasePlayer {

  initializeFaction(factionId) {
    this.factionId = factionId
    this.faction = res.getFaction(factionId)

    // Command sheet
    const starting = this.faction.startingCommandTokens
    this.commandTokens = {
      tactics: starting.tactics,
      strategy: starting.strategy,
      fleet: starting.fleet,
    }

    // Resources
    this.tradeGoods = 0
    this.commodities = 0
    this.maxCommodities = this.faction.commodities

    // Scoring
    this.victoryPoints = 0

    // Strategy cards (picked during strategy phase)
    this.strategyCards = []  // array of { id, used }

    // Passed during action phase
    this.passed = false

    // Leaders
    this.leaders = {
      agent: 'ready',
      commander: 'locked',
      hero: 'locked',
    }
  }

  // ---------------------------------------------------------------------------
  // Command tokens
  // ---------------------------------------------------------------------------

  getTacticTokens() {
    return this.commandTokens.tactics
  }

  getStrategyTokens() {
    return this.commandTokens.strategy
  }

  getFleetTokens() {
    return this.commandTokens.fleet
  }

  spendTacticToken() {
    if (this.commandTokens.tactics <= 0) {
      throw new Error(`${this.name} has no tactic tokens to spend`)
    }
    this.commandTokens.tactics--
  }

  spendStrategyToken() {
    if (this.commandTokens.strategy <= 0) {
      throw new Error(`${this.name} has no strategy tokens to spend`)
    }
    this.commandTokens.strategy--
  }

  setCommandTokens(tokens) {
    this.commandTokens = { ...tokens }
  }

  // ---------------------------------------------------------------------------
  // Resources
  // ---------------------------------------------------------------------------

  getTradeGoods() {
    return this.tradeGoods
  }

  addTradeGoods(amount) {
    this.tradeGoods += amount
  }

  spendTradeGoods(amount) {
    if (this.tradeGoods < amount) {
      throw new Error(`${this.name} has only ${this.tradeGoods} trade goods, needs ${amount}`)
    }
    this.tradeGoods -= amount
  }

  getCommodities() {
    return this.commodities
  }

  replenishCommodities() {
    this.commodities = this.maxCommodities
  }

  // ---------------------------------------------------------------------------
  // Strategy card
  // ---------------------------------------------------------------------------

  // Returns the lowest-numbered strategy card ID (used for initiative order)
  getStrategyCardId() {
    if (this.strategyCards.length === 0) {
      return null
    }
    const sorted = [...this.strategyCards].sort((a, b) => {
      const cardA = res.getStrategyCard(a.id)
      const cardB = res.getStrategyCard(b.id)
      return cardA.number - cardB.number
    })
    return sorted[0].id
  }

  // Returns all strategy card IDs
  getStrategyCards() {
    return this.strategyCards.map(c => c.id)
  }

  pickStrategyCard(cardId) {
    this.strategyCards.push({ id: cardId, used: false })
  }

  useStrategyCard(cardId) {
    if (cardId) {
      const card = this.strategyCards.find(c => c.id === cardId && !c.used)
      if (card) {
        card.used = true
      }
      return cardId
    }
    // Default: use first unused
    const card = this.strategyCards.find(c => !c.used)
    if (card) {
      card.used = true
      return card.id
    }
    return null
  }

  hasUsedStrategyCard() {
    return this.strategyCards.length > 0 && this.strategyCards.every(c => c.used)
  }

  returnStrategyCard() {
    this.strategyCards = []
  }

  // ---------------------------------------------------------------------------
  // Technologies
  // ---------------------------------------------------------------------------

  getTechnologies() {
    const zone = this._cardZone('technologies')
    return zone ? zone.cardlist().map(c => c.id) : []
  }

  hasTechnology(techId) {
    return this.getTechnologies().includes(techId)
  }

  getTechPrerequisites() {
    const techs = this.getTechnologies()
    const counts = { blue: 0, red: 0, yellow: 0, green: 0 }
    for (const techId of techs) {
      const tech = res.getTechnology(techId)
      if (tech && tech.color && counts[tech.color] !== undefined) {
        counts[tech.color]++
      }
    }
    return counts
  }

  canResearchTechnology(techId) {
    if (this.hasTechnology(techId)) {
      return false
    }
    const tech = res.getTechnology(techId)
    if (!tech) {
      return false
    }

    const prereqs = this.getTechPrerequisites()
    const needed = {}
    for (const color of tech.prerequisites) {
      needed[color] = (needed[color] || 0) + 1
    }
    for (const [color, count] of Object.entries(needed)) {
      if ((prereqs[color] || 0) < count) {
        return false
      }
    }
    return true
  }

  // ---------------------------------------------------------------------------
  // Planets
  // ---------------------------------------------------------------------------

  getControlledPlanets() {
    const planetStates = this.game.state.planets
    return Object.entries(planetStates)
      .filter(([, state]) => state.controller === this.name)
      .map(([planetId]) => planetId)
  }

  getReadyPlanets() {
    const planetStates = this.game.state.planets
    return Object.entries(planetStates)
      .filter(([, state]) => state.controller === this.name && !state.exhausted)
      .map(([planetId]) => planetId)
  }

  getTotalResources() {
    return this.getReadyPlanets().reduce((sum, planetId) => {
      const planet = res.getPlanet(planetId)
      return sum + (planet ? planet.resources : 0)
    }, 0)
  }

  getTotalInfluence() {
    return this.getReadyPlanets().reduce((sum, planetId) => {
      const planet = res.getPlanet(planetId)
      return sum + (planet ? planet.influence : 0)
    }, 0)
  }

  // ---------------------------------------------------------------------------
  // Victory
  // ---------------------------------------------------------------------------

  getVictoryPoints() {
    return this.victoryPoints
  }

  addVictoryPoints(amount) {
    this.victoryPoints += amount
  }

  // ---------------------------------------------------------------------------
  // Pass
  // ---------------------------------------------------------------------------

  hasPassed() {
    return this.passed
  }

  pass() {
    this.passed = true
  }

  resetPassed() {
    this.passed = false
  }

  // ---------------------------------------------------------------------------
  // Zone accessors
  // ---------------------------------------------------------------------------

  _cardZone(zoneName) {
    try {
      return this.game.zones.byPlayer(this, zoneName)
    }
    catch {
      return null
    }
  }
}

module.exports = { TwilightPlayer }
