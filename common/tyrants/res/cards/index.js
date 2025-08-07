const { TyrantsCard } = require('../../TyrantsCard.js')

const baseExp = require('./base.js')
const demonsExp = require('./demons.js')
const dragonsExp = require('./dragons.js')
const drowExp = require('./drow.js')
const elementalExp = require('./elementals.js')
const illithidExp = require('./illithid.js')
const undeadExp = require('./undead.js')

const baseData = [
  ...baseExp.cardData,
  ...demonsExp.cardData,
  ...dragonsExp.cardData,
  ...drowExp.cardData,
  ...elementalExp.cardData,
  ...illithidExp.cardData,
  ...undeadExp.cardData,
]


function factory(game) {
  const cards = []
  const byExpansion = {}
  const byId = {}
  const byName = {}
  for (const data of baseData) {
    for (let i = 0; i < data.count; i++) {
      const id = data.name.toLowerCase().replaceAll(' ', '-') + '-' + i
      data.id = id
      const card = new TyrantsCard(game, data)

      cards.push(card)
      byId[card.id] = card

      if (!Object.hasOwn(byExpansion, card.expansion)) {
        byExpansion[card.expansion] = []
      }
      byExpansion[card.expansion].push(card)

      if (!Object.hasOwn(byName, card.name)) {
        byName[card.name] = []
      }
      byName[card.name].push(card)
    }
  }
  return {
    all: cards,
    byExpansion,
    byId,
    byName,
  }
}

module.exports = {
  factory,
}
