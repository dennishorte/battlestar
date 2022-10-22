const Card = require('./Card.js')

const baseExp = require('./resources_cards_base.js')
const dragonsExp = require('./resources_cards_dragons.js')
const drowExp = require('./resources_cards_drow.js')

const baseData = [
  ...baseExp.cardData,
  ...dragonsExp.cardData,
  ...drowExp.cardData,
]

const cards = []
const byExpansion = {}
const byId = {}
const byName = {}
for (const data of baseData) {
  for (let i = 0; i < data.count; i++) {
    const id = data.name.toLowerCase().replaceAll(' ', '-') + '-' + i
    const card = new Card(id, data)

    cards.push(card)
    byId[card.id] = card

    if (!byExpansion.hasOwnProperty(card.expansion)) {
      byExpansion[card.expansion] = []
    }
    byExpansion[card.expansion].push(card)

    if (!byName.hasOwnProperty(card.name)) {
      byName[card.name] = []
    }
    byName[card.name].push(card)
  }
}

module.exports = {
  all: cards,
  byExpansion,
  byId,
  byName,
}
