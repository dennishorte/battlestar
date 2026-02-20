const { getUnit } = require('../res/units.js')


/**
 * Unit provides convenience accessors over a unit object in game.state.units.
 * Unit objects are stored as plain objects: { id, type, owner, damaged }
 */
class Unit {
  constructor(unitData) {
    this.id = unitData.id
    this.type = unitData.type
    this.owner = unitData.owner
    this.damaged = unitData.damaged || false
  }

  get definition() {
    return getUnit(this.type)
  }

  get name() {
    return this.definition?.name || this.type
  }

  get category() {
    return this.definition?.category || 'unknown'
  }

  get cost() {
    return this.definition?.cost || 0
  }

  get combat() {
    return this.definition?.combat || 0
  }

  get move() {
    return this.definition?.move || 0
  }

  get capacity() {
    return this.definition?.capacity || 0
  }

  get abilities() {
    return this.definition?.abilities || []
  }

  isShip() {
    return this.category === 'ship'
  }

  isGroundForce() {
    return this.category === 'ground'
  }

  isStructure() {
    return this.category === 'structure'
  }

  isDamaged() {
    return this.damaged
  }

  canSustainDamage() {
    return this.abilities.includes('sustain-damage')
  }

  sustainDamage() {
    if (!this.canSustainDamage()) {
      throw new Error(`${this.name} cannot sustain damage`)
    }
    if (this.damaged) {
      throw new Error(`${this.name} is already damaged`)
    }
    this.damaged = true
  }

  repair() {
    this.damaged = false
  }

  requiresCapacity() {
    return this.definition?.requiresCapacity || false
  }
}

module.exports = { Unit }
