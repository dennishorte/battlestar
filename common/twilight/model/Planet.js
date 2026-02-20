const { getPlanet } = require('../res/planets.js')


/**
 * Planet provides convenience accessors over game.state.planets[id].
 */
class Planet {
  constructor(game, planetId) {
    this.game = game
    this.planetId = planetId
  }

  get definition() {
    return getPlanet(this.planetId)
  }

  get state() {
    return this.game.state.planets[this.planetId]
  }

  get name() {
    return this.definition?.name || this.planetId
  }

  get resources() {
    return this.definition?.resources || 0
  }

  get influence() {
    return this.definition?.influence || 0
  }

  get trait() {
    return this.definition?.trait || null
  }

  get techSpecialty() {
    return this.definition?.techSpecialty || null
  }

  get legendary() {
    return this.definition?.legendary || false
  }

  get controller() {
    return this.state?.controller || null
  }

  get exhausted() {
    return this.state?.exhausted || false
  }

  get attachments() {
    return this.state?.attachments || []
  }

  isControlledBy(playerName) {
    return this.controller === playerName
  }

  isExhausted() {
    return this.exhausted
  }

  isReady() {
    return !this.exhausted
  }

  exhaust() {
    if (this.state) {
      this.state.exhausted = true
    }
  }

  ready() {
    if (this.state) {
      this.state.exhausted = false
    }
  }

  setController(playerName) {
    if (this.state) {
      this.state.controller = playerName
    }
  }
}

module.exports = { Planet }
