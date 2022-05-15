function Card(id, data) {
  this.id = id

  for (const [key, value] of Object.entries(data)) {
    this[key] = value
  }
}

module.exports = Card
