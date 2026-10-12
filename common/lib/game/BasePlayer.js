const { GameProxy } = require('./GameProxy.js')

// Log arg classes for counter deltas: green for gains, red for losses.
function deltaClasses(delta) {
  return ['counter-delta', delta >= 0 ? 'counter-pos' : 'counter-neg']
}

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
    const final = this.counters[name] + count

    if (!opts.silent) {
      this.log.add({
        template: "{player} '{counter}': {initial} {sign} {amount} = {final}",
        args: {
          player: this,
          counter: { value: name, classes: ['counter-name'], hl: true },
          initial: this.counters[name],
          sign: { value: count >= 0 ? '+' : '-', classes: deltaClasses(count), hl: true },
          amount: { value: Math.abs(count), classes: deltaClasses(count), hl: true },
          final,
        },
        classes: ['player-counter-change'],
        merge: {
          key: `player-counter:${this.name}:${name}`,
          data: { delta: count, final },
          reduce: (prev, cur) => ({ delta: prev.delta + cur.delta, final: cur.final }),
          apply: (entry, data) => {
            entry.args.sign.value = data.delta >= 0 ? '+' : '-'
            entry.args.sign.classes = deltaClasses(data.delta)
            entry.args.amount.value = Math.abs(data.delta)
            entry.args.amount.classes = deltaClasses(data.delta)
            entry.args.final.value = data.final
          },
        },
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
          counter: { value: name, classes: ['counter-name'], hl: true },
          initial: this.counters[name],
          final: value,
        },
        classes: ['player-counter-change'],
        merge: {
          key: `player-counter-set:${this.name}:${name}`,
          data: { final: value },
          reduce: (prev, cur) => ({ final: cur.final }),
          apply: (entry, data) => {
            entry.args.final.value = data.final
          },
        },
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
