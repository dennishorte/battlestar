const util = require('../util.js')

const { BasePlayer } = require('./BasePlayer.js')


class PlayerList extends Array {
  constructor(...args) {
    super(...args)
  }

  active() {
    return this.filter(player => !player.eliminated)
  }
}


class BasePlayerManager {
  constructor(game, users, opts={}) {
    this._game = game
    this._users = [...users]

    this._players = []

    // The player who is currently supposed to take an action.
    this._currentPlayer = null

    this._opts = Object.assign({
      firstPlayerId: null,
      shuffleSeats: true,
      playerClass: BasePlayer,
    }, opts)

    this.reset()
  }

  reset() {
    this._players = this._users.map(user => new this._opts.playerClass(this._game, user))

    if (this._opts.shuffleSeats) {
      util.array.shuffle(this._players, this._game.random)
      this._game.log.add({ template: 'Players assigned to random seats' })
    }

    if (this._opts.firstPlayerId) {
      while (this._players[0].id !== this._opts.firstPlayerId) {
        this._players.push(this._players.shift())
      }
      this._game.log.add({
        template: '{player} moved to first seat',
        args: { player: this._players[0] }
      })
    }

    this._players.forEach((player, index) => {
      player.index = index  // deprecated
      player.seatNumber = index
    })

    this._currentPlayer = this._players[0]
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Actions

  advancePlayer() {
    this._currentPlayer = this.next()
  }

  passToPlayer(player) {
    this._currentPlayer = player
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get multiple players

  all() {
    return new PlayerList(...this._players)
  }

  endingWith(player) {
    const players = this.startingWith(player)
    players.push(players.shift())
    return players
  }

  opponentsOf(player) {
    return this.all().filter(other => other.team !== player.team)
  }

  other(player) {
    return this.all().filter(other => other.id !== player.id)
  }

  startingWith(player) {
    const players = this.all()
    while (players[0].id !== player.id) {
      players.push(players.shift())
    }
    return players
  }

  startingWithCurrent() {
    return this.startingWith(this.current())
  }

  teamOf(player) {
    return this.all().filter(other => other.team === player.team)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Get single players

  byId(id) {
    return this.all().find(p => p.id === id)
  }

  byName(name) {
    return this.all().find(p => p.name === name)
  }

  byOwner(obj) {
    return obj.g ? obj.g.owner : obj.owner
  }

  bySeat(index) {
    return this.all()[index]
  }

  byZone(zone) {
    // TODO: deprecate this, since the player can be taken straight off the zone
    return zone.owner()
  }

  current() {
    return this._currentPlayer
  }

  first() {
    return this.all()[0]
  }

  following(player) {
    return this.endingWith(player).active()[0]
  }

  leftOf(player) {
    return this.following(player)
  }

  next() {
    return this.following(this.current())
  }

  preceding(player) {
    return this.startingWith(player).active().slice(-1)[0]
  }

  rightOf(player) {
    return this.preceding(player)
  }
}

module.exports = {
  BasePlayerManager,
}
