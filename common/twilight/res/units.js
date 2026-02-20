// Base unit definitions for Twilight Imperium 4th Edition + PoK
//
// Unit attributes:
//   type       - Unit type identifier
//   category   - 'ship' | 'ground' | 'structure'
//   cost       - Resource cost to produce (0 for fighters/infantry via capacity)
//   combat     - Die value needed to hit (lower is better, 1-10)
//   move       - Movement value (0 for ground forces/structures)
//   capacity   - Transport capacity (can carry this many fighters/infantry)
//   hits       - Number of hits to destroy (default 1)
//   abilities  - Array of ability strings
//   limit      - Max number a player can have on the board
//   produced   - 'ship' or 'ground' (for production capacity tracking)

const units = {
  // Ships
  'war-sun': {
    type: 'war-sun',
    name: 'War Sun',
    category: 'ship',
    cost: 12,
    combat: 3,
    move: 2,
    capacity: 6,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-3x3'],
    limit: 2,
    produced: 'ship',
  },
  'dreadnought': {
    type: 'dreadnought',
    name: 'Dreadnought',
    category: 'ship',
    cost: 4,
    combat: 5,
    move: 1,
    capacity: 1,
    hits: 2,
    abilities: ['sustain-damage', 'bombardment-5x1'],
    limit: 5,
    produced: 'ship',
  },
  'carrier': {
    type: 'carrier',
    name: 'Carrier',
    category: 'ship',
    cost: 3,
    combat: 9,
    move: 1,
    capacity: 4,
    hits: 1,
    abilities: [],
    limit: 4,
    produced: 'ship',
  },
  'cruiser': {
    type: 'cruiser',
    name: 'Cruiser',
    category: 'ship',
    cost: 2,
    combat: 7,
    move: 2,
    capacity: 0,
    hits: 1,
    abilities: [],
    limit: 8,
    produced: 'ship',
  },
  'destroyer': {
    type: 'destroyer',
    name: 'Destroyer',
    category: 'ship',
    cost: 1,
    combat: 9,
    move: 2,
    capacity: 0,
    hits: 1,
    abilities: ['anti-fighter-barrage-9x2'],
    limit: 8,
    produced: 'ship',
  },
  'fighter': {
    type: 'fighter',
    name: 'Fighter',
    category: 'ship',
    cost: 1,  // 2 for 1 resource
    combat: 9,
    move: 0,
    capacity: 0,
    hits: 1,
    abilities: [],
    limit: -1,  // unlimited (tracked by capacity)
    produced: 'ship',
    requiresCapacity: true,
  },
  'flagship': {
    type: 'flagship',
    name: 'Flagship',
    category: 'ship',
    // Stats defined per-faction in faction files
    cost: 8,
    combat: 7,
    move: 1,
    capacity: 3,
    hits: 2,
    abilities: ['sustain-damage'],
    limit: 1,
    produced: 'ship',
  },

  // Ground Forces
  'infantry': {
    type: 'infantry',
    name: 'Infantry',
    category: 'ground',
    cost: 1,  // 2 for 1 resource
    combat: 8,
    move: 0,
    capacity: 0,
    hits: 1,
    abilities: [],
    limit: -1,
    produced: 'ground',
    requiresCapacity: true,
  },
  'mech': {
    type: 'mech',
    name: 'Mech',
    category: 'ground',
    cost: 2,
    combat: 6,
    move: 0,
    capacity: 0,
    hits: 2,
    abilities: ['sustain-damage'],
    limit: 4,
    produced: 'ground',
  },

  // Structures
  'pds': {
    type: 'pds',
    name: 'PDS',
    category: 'structure',
    cost: 0,
    combat: 0,
    move: 0,
    capacity: 0,
    hits: 1,
    abilities: ['space-cannon-6x1', 'planetary-shield'],
    limit: 6,
    produced: 'ground',
  },
  'space-dock': {
    type: 'space-dock',
    name: 'Space Dock',
    category: 'structure',
    cost: 0,
    combat: 0,
    move: 0,
    capacity: 3,  // fighter capacity
    hits: 1,
    abilities: ['production'],
    limit: 3,
    produced: 'ground',
    productionValue: 2,  // PRODUCTION value = resource value of planet + 2
  },
}

function getUnit(type) {
  return units[type]
}

function getAllUnits() {
  return Object.values(units)
}

function getShipTypes() {
  return Object.values(units).filter(u => u.category === 'ship').map(u => u.type)
}

function getGroundTypes() {
  return Object.values(units).filter(u => u.category === 'ground').map(u => u.type)
}

function getStructureTypes() {
  return Object.values(units).filter(u => u.category === 'structure').map(u => u.type)
}

module.exports = {
  units,
  getUnit,
  getAllUnits,
  getShipTypes,
  getGroundTypes,
  getStructureTypes,
}
