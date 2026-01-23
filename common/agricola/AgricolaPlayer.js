const { BasePlayer } = require('../lib/game/index.js')


class AgricolaPlayer extends BasePlayer {

  initializeResources() {
    // Starting resources
    this.food = 0
    this.wood = 0
    this.clay = 0
    this.stone = 0
    this.reed = 0
    this.grain = 0
    this.vegetables = 0

    // Animals
    this.sheep = 0
    this.boar = 0
    this.cattle = 0

    // Family members (start with 2)
    this.familyMembers = 2
    this.availableWorkers = 2

    // Farm state
    this.rooms = 2  // Start with 2 wooden rooms
    this.roomType = 'wood'
    this.fields = 0
    this.pastures = 0
    this.stables = 0
  }

  // ---------------------------------------------------------------------------
  // Resource methods
  // ---------------------------------------------------------------------------

  addResource(type, amount) {
    if (this[type] !== undefined) {
      this[type] += amount
    }
  }

  removeResource(type, amount) {
    if (this[type] !== undefined) {
      this[type] = Math.max(0, this[type] - amount)
    }
  }

  hasResource(type, amount) {
    return this[type] !== undefined && this[type] >= amount
  }

  getResources() {
    return {
      food: this.food,
      wood: this.wood,
      clay: this.clay,
      stone: this.stone,
      reed: this.reed,
      grain: this.grain,
      vegetables: this.vegetables,
      sheep: this.sheep,
      boar: this.boar,
      cattle: this.cattle,
    }
  }

  // ---------------------------------------------------------------------------
  // Family methods
  // ---------------------------------------------------------------------------

  getFamilySize() {
    return this.familyMembers
  }

  getAvailableWorkers() {
    return this.availableWorkers
  }

  useWorker() {
    if (this.availableWorkers > 0) {
      this.availableWorkers -= 1
      return true
    }
    return false
  }

  resetWorkers() {
    this.availableWorkers = this.familyMembers
  }

  // ---------------------------------------------------------------------------
  // Farm methods
  // ---------------------------------------------------------------------------

  getRoomCount() {
    return this.rooms
  }

  getFieldCount() {
    return this.fields
  }

  getPastureCount() {
    return this.pastures
  }

  // ---------------------------------------------------------------------------
  // Scoring
  // ---------------------------------------------------------------------------

  calculateScore() {
    let score = 0

    // Fields (0-4 points based on count)
    score += this._scoreCategory(this.fields, [-1, -1, 1, 2, 3, 4])

    // Pastures (0-4 points based on count)
    score += this._scoreCategory(this.pastures, [-1, 1, 2, 3, 4])

    // Grain (0-4 points based on count)
    score += this._scoreCategory(this.grain, [-1, -1, 1, 1, 2, 2, 3, 3, 4])

    // Vegetables (0-4 points based on count)
    score += this._scoreCategory(this.vegetables, [-1, 1, 2, 3, 4])

    // Sheep (0-4 points based on count)
    score += this._scoreCategory(this.sheep, [-1, -1, 1, 1, 2, 2, 3, 3, 4])

    // Boar (0-4 points based on count)
    score += this._scoreCategory(this.boar, [-1, -1, 1, 1, 2, 2, 3, 3, 4])

    // Cattle (0-4 points based on count)
    score += this._scoreCategory(this.cattle, [-1, 1, 1, 2, 2, 3, 3, 4])

    // Family members (3 points each)
    score += this.familyMembers * 3

    // Rooms (1 point each for clay/stone)
    if (this.roomType !== 'wood') {
      score += this.rooms
    }

    return score
  }

  _scoreCategory(value, thresholds) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= i) {
        return thresholds[i]
      }
    }
    return thresholds[0]
  }
}

module.exports = { AgricolaPlayer }
