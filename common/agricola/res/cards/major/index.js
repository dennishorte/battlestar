/**
 * Major Improvements for Agricola (Revised Edition)
 * 10 base + 8 expansion (5-6 player)
 */

const Fireplace2 = require('./Fireplace2.js')
const Fireplace3 = require('./Fireplace3.js')
const CookingHearth4 = require('./CookingHearth4.js')
const CookingHearth5 = require('./CookingHearth5.js')
const ClayOven = require('./ClayOven.js')
const StoneOven = require('./StoneOven.js')
const Joinery = require('./Joinery.js')
const Pottery = require('./Pottery.js')
const BasketmakersWorkshop = require('./BasketmakersWorkshop.js')
const Well = require('./Well.js')
const Fireplace4 = require('./Fireplace4.js')
const CookingHearth6 = require('./CookingHearth6.js')
const Well2 = require('./Well2.js')
const ClayOven2 = require('./ClayOven2.js')
const StoneOven2 = require('./StoneOven2.js')
const Joinery2 = require('./Joinery2.js')
const Pottery2 = require('./Pottery2.js')
const BasketmakersWorkshop2 = require('./BasketmakersWorkshop2.js')

const cardData = [
  Fireplace2,
  Fireplace3,
  CookingHearth4,
  CookingHearth5,
  ClayOven,
  StoneOven,
  Joinery,
  Pottery,
  BasketmakersWorkshop,
  Well,
  Fireplace4,
  CookingHearth6,
  Well2,
  ClayOven2,
  StoneOven2,
  Joinery2,
  Pottery2,
  BasketmakersWorkshop2,
]

function getCardById(id) {
  return cardData.find(c => c.id === id)
}

function getCardByName(name) {
  return cardData.find(c => c.name === name)
}

function getMajorImprovements() {
  return cardData.filter(c => c.type === 'major')
}

function getAllCards() {
  return [...cardData]
}

function getCardsByPlayerCount(playerCount) {
  return cardData.filter(card => {
    if (!card.expansion) {
      return true
    }
    if (card.expansion === '5-6') {
      return playerCount >= 5
    }
    return true
  })
}

// For compatibility with card set modules (major has no occupations/minors)
function getMinorImprovements() {
  return []
}

function getOccupations() {
  return []
}

module.exports = {
  cardData,
  getCardById,
  getCardByName,
  getMajorImprovements,
  getAllCards,
  getCardsByPlayerCount,
  getMinorImprovements,
  getOccupations,
}
