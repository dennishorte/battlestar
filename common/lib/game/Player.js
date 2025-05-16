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

  incrementCounter(name, count=1) {
    this.counters[name] += count
    this.game.log.add({
      template: '{player} counter {counter}: {amount}',
      args: {
        player: this,
        counter: name,
        amount: count,
      },
      classes: ['player-counter-change'],
    })
  }

  static isActive(player) {
    return !player.eliminated
  }
}

module.exports = { Player }
