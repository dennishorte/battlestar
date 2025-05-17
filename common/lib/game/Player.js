class Player {
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
  }

  addCounter(name, count=0) {
    this.counters[name] = count
  }

  decrementCounter(name, count=1) {
    this.incrementCounter(name, -count)
  }

  getCounter(name) {
    return this.counters[name] || 0
  }

  incrementCounter(name, count=1, opts={}) {
    if (!opts.silent) {
      this.game.log.add({
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
  }

  setCounter(name, value, opts={}) {
    if (!opts.silent) {
      this.game.log.add({
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

    this.counters[name] = value
  }

  static isActive(player) {
    return !player.eliminated
  }
}

module.exports = { Player }
