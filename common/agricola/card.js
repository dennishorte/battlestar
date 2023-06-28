function Card() {
  this.expansion = 'revised'
  this.deck = 'undefined'
  this.type = 'undefined'

  // Used for the action cards
  this.stage = -1

  // Used by professions. 1 = 1 or more players; 3 = 3 or more players; etc.
  this.numPlayers = 1

  this.id = 'invalid_id'
  this.name = 'Card Name'
  this.vps = 0
  this.passLeft = false

  // Costs are stated in objects; multiple objects implies "or" costs.
  // example: [{ clay: 4 }, { special: 'return an oven' }] mean pay 2 clay OR return an over
  this.cost = []
  this.prereqs = []

  this.text = []
  this.impl = []
}

function fromObject(obj) {
  const card = new Card()
  Object.assign(card, obj)
  return card
}


module.exports = {
  Card,
  fromObject,
}
