/**
 * CommandSheet manages a player's command token pools.
 * Provides validation and redistribution logic.
 */
class CommandSheet {
  constructor(tactics, strategy, fleet) {
    this.tactics = tactics
    this.strategy = strategy
    this.fleet = fleet
  }

  total() {
    return this.tactics + this.strategy + this.fleet
  }

  /**
   * Redistribute tokens to new pool values.
   * Total must equal current total + additional tokens.
   */
  redistribute(newTactics, newStrategy, newFleet, additionalTokens = 0) {
    const expectedTotal = this.total() + additionalTokens
    const newTotal = newTactics + newStrategy + newFleet

    if (newTotal !== expectedTotal) {
      throw new Error(
        `Token redistribution invalid: expected total ${expectedTotal}, got ${newTotal}`
      )
    }

    this.tactics = newTactics
    this.strategy = newStrategy
    this.fleet = newFleet
  }

  toJSON() {
    return {
      tactics: this.tactics,
      strategy: this.strategy,
      fleet: this.fleet,
    }
  }

  static fromJSON(data) {
    return new CommandSheet(data.tactics, data.strategy, data.fleet)
  }
}

module.exports = { CommandSheet }
