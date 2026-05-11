const { GameProxy } = require('./GameProxy.js')

class BasePlayer {
  constructor(game, data) {
    this.game = game

    this._id = data._id
    this.id = data.name
    this.name = data.name
    this.team = data.team || data.name

    this.index = undefined // deprecated version of seatNumber
    this.seatNumber = undefined

    this.eliminated = false

    this.counters = {}

    return GameProxy.create(this)
  }

  addCounter(name, count=0) {
    this.counters[name] = count
  }

  decrementCounter(name, count=1, opts={}) {
    this.incrementCounter(name, -count, opts)
  }

  getCounter(name) {
    return this.counters[name] || 0
  }

  incrementCounter(name, count=1, opts={}) {
    if (!opts.silent) {
      this.log.add({
        template: "{player} '{counter}': {initial} {sign} {amount} = {final}",
        args: {
          player: this,
          counter: name,
          initial: this.counters[name],
          sign: count >= 0 ? '+' : '-',
          amount: Math.abs(count),
          final: this.counters[name] + count,
        },
        classes: ['player-counter-change'],
      })
    }

    this.counters[name] += count
    this._recordCounterChange(name, count, this.counters[name], opts.source)
  }

  isCurrentPlayer() {
    return this.game.players.current().id === this.id
  }

  isOpponent(other) {
    return this.team !== other.team
  }

  setCounter(name, value, opts={}) {
    if (!opts.silent) {
      this.log.add({
        template: "{player} '{counter}': set from {initial} to {final}",
        args: {
          player: this,
          counter: name,
          initial: this.counters[name],
          final: value,
        },
        classes: ['player-counter-change'],
      })
    }

    const before = this.counters[name] || 0
    this.counters[name] = value
    this._recordCounterChange(name, value - before, value, opts.source)
  }

  // Record a counter mutation in game.state.counterHistory for later
  // breakdown UIs. Skips zero-delta writes (no-op setCounter calls).
  // Source can be a plain label string or { label, ref? }; normalized
  // on write so consumers always see the structured form.
  _recordCounterChange(counter, delta, total, source) {
    if (delta === 0) {
      return
    }
    if (!this.game.state.counterHistory) {
      this.game.state.counterHistory = {}
    }
    if (!this.game.state.counterHistory[this.name]) {
      this.game.state.counterHistory[this.name] = []
    }
    this.game.state.counterHistory[this.name].push({
      counter,
      delta,
      total,
      source: this._normalizeSource(source),
      round: this.game.state.round ?? null,
      turn: this.game.state.turn ?? null,
    })
  }

  _normalizeSource(source) {
    if (!source) {
      return null
    }
    if (typeof source === 'string') {
      return { label: source }
    }
    return source
  }

  static isActive(player) {
    return !player.eliminated
  }
}

module.exports = { BasePlayer }
