function Token(id, name) {
  this.id = id
  this.name = name

  this.zone = undefined
  this.owner = undefined

  this.isTroop = false
  this.isSpy = false

  this.visibility = []
}

module.exports = Token
