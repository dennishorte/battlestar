// Agricola game resources - central export

const actionSpaces = require('./actionSpaces.js')
const majorImprovements = require('./majorImprovements.js')
const scoringTables = require('./scoringTables.js')
const baseA = require('./cards/baseA.js')
const baseB = require('./cards/baseB.js')

// Re-export everything from sub-modules
module.exports = {
  // Action Spaces
  ...actionSpaces,

  // Major Improvements
  ...majorImprovements,

  // Scoring
  ...scoringTables,

  // Building costs
  buildingCosts: {
    room: {
      wood: { wood: 5, reed: 2 },
      clay: { clay: 5, reed: 2 },
      stone: { stone: 5, reed: 2 },
    },
    renovation: {
      woodToClay: { clay: 1, reed: 1 }, // clay per room + 1 reed total
      clayToStone: { stone: 1, reed: 1 }, // stone per room + 1 reed total
    },
    stable: { wood: 2 },
    fence: { wood: 1 },
  },

  // Game constants
  constants: {
    totalRounds: 14,
    harvestRounds: [4, 7, 9, 11, 13, 14],
    stagesEndRound: {
      1: 4,
      2: 7,
      3: 9,
      4: 11,
      5: 13,
      6: 14,
    },
    roundToStage: {
      1: 1, 2: 1, 3: 1, 4: 1,
      5: 2, 6: 2, 7: 2,
      8: 3, 9: 3,
      10: 4, 11: 4,
      12: 5, 13: 5,
      14: 6,
    },
    maxFamilyMembers: 5,
    maxStables: 4,
    maxFences: 15,
    farmyardRows: 3,
    farmyardCols: 5,
    startingRooms: 2,
    startingFamilyMembers: 2,
    startingFoodFirstPlayer: 2,
    startingFoodOtherPlayers: 3,
    foodPerFamilyMember: 2,
    foodPerNewborn: 1,
    sowingGrain: 3, // Place 1 grain, add 2 more = 3 total
    sowingVegetables: 2, // Place 1 vegetable, add 1 more = 2 total
  },

  // Upgrade paths for house materials
  houseMaterialUpgrades: {
    wood: 'clay',
    clay: 'stone',
    stone: null, // Cannot upgrade further
  },

  // Animal types
  animalTypes: ['sheep', 'boar', 'cattle'],

  // Resource types
  resourceTypes: ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables'],

  // Accumulation rates (convenience accessor)
  accumulation: actionSpaces.getAccumulationRates(),

  // Cards
  cards: {
    baseA,
    baseB,
  },
  getCardById(id) {
    return baseA.getCardById(id) || baseB.getCardById(id)
  },
  getCardByName(name) {
    return baseA.getCardByName(name) || baseB.getCardByName(name)
  },
  getMinorImprovements() {
    return [...baseA.getMinorImprovements(), ...baseB.getMinorImprovements()]
  },
  getOccupations() {
    return [...baseA.getOccupations(), ...baseB.getOccupations()]
  },
  getAllCards() {
    return [...baseA.getAllCards(), ...baseB.getAllCards()]
  },
  getCardsByPlayerCount(playerCount) {
    return [
      ...baseA.getCardsByPlayerCount(playerCount),
      ...baseB.getCardsByPlayerCount(playerCount),
    ]
  },
}
