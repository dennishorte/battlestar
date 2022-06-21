function Card(id, data) {
  this.id = id

  this.name = undefined
  this.aspect = undefined
  this.race = undefined
  this.expansion = undefined
  this.cost = undefined
  this.points = undefined
  this.innerPoints = undefined
  this.count = undefined
  this.text = []

  this.zone = undefined
  this.owner = undefined

  this.isTroop = false
  this.isSpy = false

  this.visibility = []

  for (const [key, value] of Object.entries(data)) {
    this[key] = value
  }
}

module.exports = Card


Card.prototype.getOwnerName = function() {
  return this.owner === undefined ? 'neutral' : this.owner.name
}
