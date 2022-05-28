function Token(id, name) {
  this.id = id
  this.name = name

  this.zone = undefined
  this.owner = undefined

  this.isTroop = false
  this.isSpy = false

  this.visibility = []
}

Token.prototype.getOwnerName = function() {
  return this.owner === undefined ? 'neutral' : this.owner.name
}

module.exports = Token
