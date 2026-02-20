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

    // Promissory notes held by this player
    // Each note: { id, owner } where owner is the player who originally owned the note
    this.promissoryNotes = []
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

  // Strip the player prefix from a tech card ID (e.g. 'dennis-neural-motivator' → 'neural-motivator')
  _rawTechId(cardId) {
    return cardId.replace(`${this.name}-`, '')
  }

  getTechnologies() {
    const zone = this._cardZone('technologies')
    return zone ? zone.cardlist().map(c => c.id) : []
  }

  // Returns raw tech IDs (without player prefix)
  getTechIds() {
    return this.getTechnologies().map(id => this._rawTechId(id))
  }

  hasTechnology(techId) {
    // Accept both prefixed and raw forms
    return this.getTechIds().includes(techId)
  }

  getTechPrerequisites() {
    const techs = this.getTechIds()
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

    // Jol-Nar Analytical: ignore 1 prerequisite for non-unit-upgrade techs
    const skipCount = this.game.factionAbilities?.getTechPrerequisiteSkips(this, tech) ?? 0

    let deficit = 0
    for (const [color, count] of Object.entries(needed)) {
      const shortfall = count - (prereqs[color] || 0)
      if (shortfall > 0) {
        deficit += shortfall
      }
    }
    return deficit <= skipCount
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
  // Promissory notes
  // ---------------------------------------------------------------------------

  getPromissoryNotes() {
    return [...this.promissoryNotes]
  }

  hasPromissoryNote(noteId, fromOwner) {
    return this.promissoryNotes.some(
      n => n.id === noteId && (!fromOwner || n.owner === fromOwner)
    )
  }

  addPromissoryNote(noteId, owner) {
    this.promissoryNotes.push({ id: noteId, owner })
  }

  removePromissoryNote(noteId, owner) {
    const idx = this.promissoryNotes.findIndex(
      n => n.id === noteId && n.owner === owner
    )
    if (idx !== -1) {
      return this.promissoryNotes.splice(idx, 1)[0]
    }
    return null
  }

  // ---------------------------------------------------------------------------
  // Leaders
  // ---------------------------------------------------------------------------

  isAgentReady() {
    return this.leaders.agent === 'ready'
  }

  exhaustAgent() {
    this.leaders.agent = 'exhausted'
  }

  readyAgent() {
    this.leaders.agent = 'ready'
  }

  isCommanderUnlocked() {
    return this.leaders.commander === 'unlocked'
  }

  unlockCommander() {
    this.leaders.commander = 'unlocked'
  }

  isHeroUnlocked() {
    return this.leaders.hero === 'unlocked'
  }

  isHeroPurged() {
    return this.leaders.hero === 'purged'
  }

  unlockHero() {
    if (this.leaders.hero !== 'purged') {
      this.leaders.hero = 'unlocked'
    }
  }

  purgeHero() {
    this.leaders.hero = 'purged'
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
