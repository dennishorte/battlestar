import cardUtil from './cardUtil.js'


const CubeUtil = {}


////////////////////////////////////////////////////////////////////////////////
// Cube Functions

function Cube(data) {
  this.data = data
}
CubeUtil.Cube = Cube

Cube.prototype.serialize = function() {
  const serializedCardlist = util.deepcopy(this.cardlist)
  for (const card of serializedCardlist) {
    delete card.data
  }

  const data = {
    userId: this.userId,
    name: this.name,
    path: this.path,
    kind: 'cube',
    createdTimestamp: this.createdTimestamp,
    updatedTimestamp: this.updatedTimestamp,
    cardlist: serializedCardlist,
  }

  if (this._id) {
    data._id = this._id
  }

  return data
}

Cube.prototype.addCard = function(card) {
  const item = {
    name: card.name,
    set: card.set,
    collector_number: card.collector_number,
  }

  if (card.card_faces) {
    item.data = card
  }

  this.cardlist.push(item)
}

Cube.prototype.removeCard = function(card) {
  // Remove exact matches
  const exactIndex = this.cardlist.findIndex(data => cardUtil.strictEquals(data, card))
  if (exactIndex >= 0) {
    this.cardlist.splice(exactIndex, 1)
    return
  }

  // Remove soft matches
  const softIndex = this.cardlist.findIndex(data => cardUtil.softEquals(data, card))
  if (softIndex >= 0) {
    this.cardlist.splice(softIndex, 1)
    return
  }

  alert('Cannot remove card; not found: \n' + JSON.stringify(card, null, 2))
}


////////////////////////////////////////////////////////////////////////////////
// CubeUtil functions

CubeUtil.deserialize = function(data) {
  const cube = new Cube()

  cube._id = data._id
  cube.userId = data.userId
  cube.name = data.name
  cube.path = data.path
  cube.cardlist = data.cardlist
  cube.createdTimestamp = data.createdTimestamp
  cube.updatedTimestamp = data.updatedTimestamp

  return cube
}

CubeUtil.generateCubeBreakdown = function(cube) {
  const cards = cardUtil.parseCardlist(cube.cardlist)

  console.log(cards)
}

export default CubeUtil
