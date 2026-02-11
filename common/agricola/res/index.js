// Agricola game resources - central export

const actionSpaces = require('./actionSpaces.js')
const colors = require('./colors.js')
const majorImprovements = require('./majorImprovements.js')
const scoringTables = require('./scoringTables.js')
const baseA = require('./cards/baseA.js')
const baseB = require('./cards/baseB.js')
const minorA = require('./cards/minorA')
const minorB = require('./cards/minorB')
const minorC = require('./cards/minorC')
const minorD = require('./cards/minorD')
const minorE = require('./cards/minorE')
const occupationA = require('./cards/occupationA')
const occupationB = require('./cards/occupationB')
const occupationC = require('./cards/occupationC')
const occupationD = require('./cards/occupationD')
const occupationE = require('./cards/occupationE')
const testCards = require('./cards/test')

// Re-export everything from sub-modules
module.exports = {
  // Colors
  colors,

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

  // Card sets
  cardSets: {
    baseA: {
      id: 'baseA',
      name: 'Base A',
      module: baseA,
      minorCount: baseA.getMinorImprovements().length,
      occupationCount: baseA.getOccupations().length,
      hidden: true, // Hide from UI, keep functional for existing games
    },
    baseB: {
      id: 'baseB',
      name: 'Base B',
      module: baseB,
      minorCount: baseB.getMinorImprovements().length,
      occupationCount: baseB.getOccupations().length,
      hidden: true, // Hide from UI, keep functional for existing games
    },
    minorA: {
      id: 'minorA',
      name: 'Minor Improvements A',
      module: minorA,
      minorCount: minorA.getMinorImprovements().length,
      occupationCount: minorA.getOccupations().length,
    },
    minorB: {
      id: 'minorB',
      name: 'Minor Improvements B',
      module: minorB,
      minorCount: minorB.getMinorImprovements().length,
      occupationCount: minorB.getOccupations().length,
    },
    minorC: {
      id: 'minorC',
      name: 'Minor Improvements C',
      module: minorC,
      minorCount: minorC.getMinorImprovements().length,
      occupationCount: minorC.getOccupations().length,
    },
    minorD: {
      id: 'minorD',
      name: 'Minor Improvements D',
      module: minorD,
      minorCount: minorD.getMinorImprovements().length,
      occupationCount: minorD.getOccupations().length,
    },
    minorE: {
      id: 'minorE',
      name: 'Minor Improvements E',
      module: minorE,
      minorCount: minorE.getMinorImprovements().length,
      occupationCount: minorE.getOccupations().length,
    },
    occupationA: {
      id: 'occupationA',
      name: 'Occupations A',
      module: occupationA,
      minorCount: occupationA.getMinorImprovements().length,
      occupationCount: occupationA.getOccupations().length,
    },
    occupationB: {
      id: 'occupationB',
      name: 'Occupations B',
      module: occupationB,
      minorCount: occupationB.getMinorImprovements().length,
      occupationCount: occupationB.getOccupations().length,
    },
    occupationC: {
      id: 'occupationC',
      name: 'Occupations C',
      module: occupationC,
      minorCount: occupationC.getMinorImprovements().length,
      occupationCount: occupationC.getOccupations().length,
    },
    occupationD: {
      id: 'occupationD',
      name: 'Occupations D',
      module: occupationD,
      minorCount: occupationD.getMinorImprovements().length,
      occupationCount: occupationD.getOccupations().length,
    },
    occupationE: {
      id: 'occupationE',
      name: 'Occupations E',
      module: occupationE,
      minorCount: occupationE.getMinorImprovements().length,
      occupationCount: occupationE.getOccupations().length,
    },
    test: {
      id: 'test',
      name: 'Test Cards',
      module: testCards,
      minorCount: testCards.getMinorImprovements().length,
      occupationCount: testCards.getOccupations().length,
      testOnly: true,
    },
  },

  // Get available card set IDs (excludes test-only sets)
  getCardSetIds() {
    return Object.keys(this.cardSets).filter(id => !this.cardSets[id].testOnly)
  },

  // Get selectable card set IDs (excludes hidden sets like baseA/baseB and test-only sets)
  getSelectableCardSetIds() {
    return Object.keys(this.cardSets).filter(id => !this.cardSets[id].hidden && !this.cardSets[id].testOnly)
  },

  // Cards - always searches all sets (for getCardById used by hooks, scoring, etc.)
  getCardById(id) {
    return baseA.getCardById(id) || baseB.getCardById(id) || minorA.getCardById(id) || minorB.getCardById(id) || minorC.getCardById(id) || minorD.getCardById(id) || minorE.getCardById(id) || occupationA.getCardById(id) || occupationB.getCardById(id) || occupationC.getCardById(id) || occupationD.getCardById(id) || occupationE.getCardById(id) || testCards.getCardById(id)
  },
  getCardByName(name) {
    return baseA.getCardByName(name) || baseB.getCardByName(name) || minorA.getCardByName(name) || minorB.getCardByName(name) || minorC.getCardByName(name) || minorD.getCardByName(name) || minorE.getCardByName(name) || occupationA.getCardByName(name) || occupationB.getCardByName(name) || occupationC.getCardByName(name) || occupationD.getCardByName(name) || occupationE.getCardByName(name) || testCards.getCardByName(name)
  },

  // Functions that filter by selected card sets
  getCardsBySet(setIds) {
    const modules = (setIds || this.getCardSetIds()).map(id => this.cardSets[id]?.module).filter(Boolean)
    const cards = []
    for (const mod of modules) {
      cards.push(...mod.getAllCards())
    }
    return cards
  },
  getCardsByPlayerCount(playerCount, setIds) {
    const modules = (setIds || this.getCardSetIds()).map(id => this.cardSets[id]?.module).filter(Boolean)
    const cards = []
    for (const mod of modules) {
      cards.push(...mod.getCardsByPlayerCount(playerCount))
    }
    return cards
  },

  // Validate that selected sets have enough cards for the player count
  validateCardSets(setIds, playerCount) {
    const cardsPerPlayer = 7
    const cards = this.getCardsByPlayerCount(playerCount, setIds)
    const occupations = cards.filter(c => c.type === 'occupation')
    const minors = cards.filter(c => c.type === 'minor')
    const neededPerType = cardsPerPlayer * playerCount

    const errors = []
    if (occupations.length < neededPerType) {
      errors.push(`Not enough occupations: need ${neededPerType}, have ${occupations.length}`)
    }
    if (minors.length < neededPerType) {
      errors.push(`Not enough minor improvements: need ${neededPerType}, have ${minors.length}`)
    }
    return { valid: errors.length === 0, errors }
  },

  // Convenience accessors (return all cards across all sets)
  getMinorImprovements() {
    return [...baseA.getMinorImprovements(), ...baseB.getMinorImprovements(), ...minorA.getMinorImprovements(), ...minorB.getMinorImprovements(), ...minorC.getMinorImprovements(), ...minorD.getMinorImprovements(), ...minorE.getMinorImprovements(), ...occupationA.getMinorImprovements(), ...occupationB.getMinorImprovements(), ...occupationC.getMinorImprovements(), ...occupationD.getMinorImprovements(), ...occupationE.getMinorImprovements()]
  },
  getOccupations() {
    return [...baseA.getOccupations(), ...baseB.getOccupations(), ...minorA.getOccupations(), ...minorB.getOccupations(), ...minorC.getOccupations(), ...minorD.getOccupations(), ...minorE.getOccupations(), ...occupationA.getOccupations(), ...occupationB.getOccupations(), ...occupationC.getOccupations(), ...occupationD.getOccupations(), ...occupationE.getOccupations()]
  },
  getAllCards() {
    return [...baseA.getAllCards(), ...baseB.getAllCards(), ...minorA.getAllCards(), ...minorB.getAllCards(), ...minorC.getAllCards(), ...minorD.getAllCards(), ...minorE.getAllCards(), ...occupationA.getAllCards(), ...occupationB.getAllCards(), ...occupationC.getAllCards(), ...occupationD.getAllCards(), ...occupationE.getAllCards()]
  },
}
