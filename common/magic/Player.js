module.exports = Player


function Player(game, data) {
  this.game = game

  this._id = data._id
  this.id = data.name
  this.name = data.name
  this.team = data.name

  this.eliminated = false

  this.counters = {
    life: 20,
  }
}

Player.prototype.getCounter = function(name) {
  return this.counters[name]
}

Player.prototype.incrementCounter = function(name, amt) {
  this.counters[name] += amt

  this.game.mLog({
    template: `{player} ${name} change {count}`,
    args: { player: this, count: amt },
    classes: ['counter-change'],
  })
}
