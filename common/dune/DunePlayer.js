const { BasePlayer } = require('../lib/game/index.js')
const constants = require('./res/constants.js')

class DunePlayer extends BasePlayer {
  constructor(game, data) {
    super(game, data)

    // Resources
    this.addCounter('solari', 0)
    this.addCounter('spice', 0)
    this.addCounter('water', 0)

    // Victory points
    this.addCounter('vp', 0)

    // Agents
    this.addCounter('agents', constants.STARTING_AGENTS)
    this.addCounter('hasSwordmaster', 0)

    // Troops
    this.addCounter('troopsInGarrison', constants.STARTING_TROOPS_IN_GARRISON)
    this.addCounter('troopsInSupply', constants.STARTING_TROOPS_IN_SUPPLY)

    // Spies
    this.addCounter('spiesInSupply', constants.STARTING_SPIES)

    // Faction influence
    for (const faction of constants.FACTIONS) {
      this.addCounter(`influence_${faction}`, 0)
    }

    // Turn state (reset each round)
    this.addCounter('persuasion', 0)
    this.addCounter('hasRevealed', 0)
    this.addCounter('agentsPlaced', 0)

    // High Council seat
    this.addCounter('hasHighCouncil', 0)
  }

  // Resource getters
  get solari() {
    return this.getCounter('solari')
  }
  get spice() {
    return this.getCounter('spice')
  }
  get water() {
    return this.getCounter('water')
  }
  get vp() {
    return this.getCounter('vp')
  }

  // Agent management
  get availableAgents() {
    const total = this.getCounter('agents') + this.getCounter('hasSwordmaster')
    return total - this.getCounter('agentsPlaced')
  }

  // Troop management
  get troopsInGarrison() {
    return this.getCounter('troopsInGarrison')
  }
  get troopsInSupply() {
    return this.getCounter('troopsInSupply')
  }

  // Spy management
  get spiesInSupply() {
    return this.getCounter('spiesInSupply')
  }

  // Faction influence
  getInfluence(faction) {
    return this.getCounter(`influence_${faction}`)
  }

  setInfluence(faction, value) {
    this.setCounter(`influence_${faction}`, value, { silent: true })
  }

  gainInfluence(faction, amount = 1) {
    this.incrementCounter(`influence_${faction}`, amount, { silent: true })
  }

  loseInfluence(faction, amount = 1) {
    this.decrementCounter(`influence_${faction}`, amount, { silent: true })
  }

  // Combat: derived from live Conflict state rather than a maintained counter,
  // so it can never go stale relative to deployedTroops/deployedSandworms —
  // a unit deployed or retreated at any point (Agent Turn, Plot Intrigue,
  // Combat-phase Intrigue) is reflected the instant it's read. Only the
  // troops/sandworms portion requires units present (rules.txt:363); card,
  // leader, and intrigue strength bonuses (e.g. Devious Strength, Calculus
  // of Power) are unconditional, matching how addStrength has always worked.
  get strength() {
    const conflict = this.game.state.conflict
    const troops = conflict?.deployedTroops?.[this.name] || 0
    const sandworms = conflict?.deployedSandworms?.[this.name] || 0
    const unitStrength = (troops + sandworms) > 0
      ? troops * constants.TROOP_STRENGTH + sandworms * constants.SANDWORM_STRENGTH
      : 0

    const extra = (conflict?.strengthBreakdown?.[this.name] || [])
      .filter(b => b.source !== 'troops' && b.source !== 'sandworms')
      .reduce((sum, b) => sum + b.amount, 0)

    return unitStrength + extra
  }

  // High Council
  get hasHighCouncil() {
    return this.getCounter('hasHighCouncil') > 0
  }
}

module.exports = { DunePlayer }
