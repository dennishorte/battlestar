// Technology definitions for Twilight Imperium 4th Edition + PoK
//
// Technology attributes:
//   id            - Unique identifier
//   name          - Display name
//   color         - 'blue' | 'red' | 'yellow' | 'green' | 'unit-upgrade' | null (faction)
//   prerequisites - Array of color strings required (e.g., ['blue', 'blue'] needs 2 blue)
//   faction       - Faction ID if faction-specific, null if generic
//   unitUpgrade   - Unit type this upgrades, null if not a unit upgrade

const technologies = [
  // ============================================================
  // Blue (Propulsion)
  // ============================================================
  {
    id: 'antimass-deflectors',
    name: 'Antimass Deflectors',
    color: 'blue',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'gravity-drive',
    name: 'Gravity Drive',
    color: 'blue',
    prerequisites: ['blue'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'fleet-logistics',
    name: 'Fleet Logistics',
    color: 'blue',
    prerequisites: ['blue', 'blue'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'light-wave-deflector',
    name: 'Light/Wave Deflector',
    color: 'blue',
    prerequisites: ['blue', 'blue', 'blue'],
    faction: null,
    unitUpgrade: null,
  },
  // PoK Blue
  {
    id: 'dark-energy-tap',
    name: 'Dark Energy Tap',
    color: 'blue',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'sling-relay',
    name: 'Sling Relay',
    color: 'blue',
    prerequisites: ['blue'],
    faction: null,
    unitUpgrade: null,
  },

  // ============================================================
  // Red (Warfare)
  // ============================================================
  {
    id: 'plasma-scoring',
    name: 'Plasma Scoring',
    color: 'red',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'magen-defense-grid',
    name: 'Magen Defense Grid',
    color: 'red',
    prerequisites: ['red'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'duranium-armor',
    name: 'Duranium Armor',
    color: 'red',
    prerequisites: ['red', 'red'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'assault-cannon',
    name: 'Assault Cannon',
    color: 'red',
    prerequisites: ['red', 'red', 'red'],
    faction: null,
    unitUpgrade: null,
  },
  // PoK Red
  {
    id: 'ai-development-algorithm',
    name: 'AI Development Algorithm',
    color: 'red',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'self-assembly-routines',
    name: 'Self Assembly Routines',
    color: 'red',
    prerequisites: ['red'],
    faction: null,
    unitUpgrade: null,
  },

  // ============================================================
  // Yellow (Cybernetic)
  // ============================================================
  {
    id: 'sarween-tools',
    name: 'Sarween Tools',
    color: 'yellow',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'graviton-laser-system',
    name: 'Graviton Laser System',
    color: 'yellow',
    prerequisites: ['yellow'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'transit-diodes',
    name: 'Transit Diodes',
    color: 'yellow',
    prerequisites: ['yellow', 'yellow'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'integrated-economy',
    name: 'Integrated Economy',
    color: 'yellow',
    prerequisites: ['yellow', 'yellow', 'yellow'],
    faction: null,
    unitUpgrade: null,
  },
  // PoK Yellow
  {
    id: 'scanlink-drone-network',
    name: 'Scanlink Drone Network',
    color: 'yellow',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'predictive-intelligence',
    name: 'Predictive Intelligence',
    color: 'yellow',
    prerequisites: ['yellow'],
    faction: null,
    unitUpgrade: null,
  },

  // ============================================================
  // Green (Biotic)
  // ============================================================
  {
    id: 'neural-motivator',
    name: 'Neural Motivator',
    color: 'green',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'dacxive-animators',
    name: 'Dacxive Animators',
    color: 'green',
    prerequisites: ['green'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'hyper-metabolism',
    name: 'Hyper Metabolism',
    color: 'green',
    prerequisites: ['green', 'green'],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'x89-bacterial-weapon',
    name: 'X-89 Bacterial Weapon',
    color: 'green',
    prerequisites: ['green', 'green', 'green'],
    faction: null,
    unitUpgrade: null,
  },
  // PoK Green
  {
    id: 'psychoarchaeology',
    name: 'Psychoarchaeology',
    color: 'green',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
  },
  {
    id: 'bio-stims',
    name: 'Bio-Stims',
    color: 'green',
    prerequisites: ['green'],
    faction: null,
    unitUpgrade: null,
  },

  // ============================================================
  // Unit Upgrades (generic)
  // ============================================================
  {
    id: 'infantry-ii',
    name: 'Infantry II',
    color: 'unit-upgrade',
    prerequisites: ['green', 'green'],
    faction: null,
    unitUpgrade: 'infantry',
    stats: { combat: 7 },
  },
  {
    id: 'fighter-ii',
    name: 'Fighter II',
    color: 'unit-upgrade',
    prerequisites: ['green', 'green'],
    faction: null,
    unitUpgrade: 'fighter',
    stats: { combat: 8, move: 2, requiresCapacity: false },
  },
  {
    id: 'pds-ii',
    name: 'PDS II',
    color: 'unit-upgrade',
    prerequisites: ['yellow', 'red'],
    faction: null,
    unitUpgrade: 'pds',
    stats: { abilities: ['space-cannon-5x1', 'planetary-shield'] },
  },
  {
    id: 'space-dock-ii',
    name: 'Space Dock II',
    color: 'unit-upgrade',
    prerequisites: ['yellow', 'yellow'],
    faction: null,
    unitUpgrade: 'space-dock',
    stats: { productionValue: 4 },
  },
  {
    id: 'carrier-ii',
    name: 'Carrier II',
    color: 'unit-upgrade',
    prerequisites: ['blue', 'blue'],
    faction: null,
    unitUpgrade: 'carrier',
    stats: { combat: 9, move: 2, capacity: 6 },
  },
  {
    id: 'cruiser-ii',
    name: 'Cruiser II',
    color: 'unit-upgrade',
    prerequisites: ['green', 'yellow', 'red'],
    faction: null,
    unitUpgrade: 'cruiser',
    stats: { combat: 6, move: 3, capacity: 1 },
  },
  {
    id: 'destroyer-ii',
    name: 'Destroyer II',
    color: 'unit-upgrade',
    prerequisites: ['red', 'red'],
    faction: null,
    unitUpgrade: 'destroyer',
    stats: { combat: 8, abilities: ['anti-fighter-barrage-6x3'] },
  },
  {
    id: 'dreadnought-ii',
    name: 'Dreadnought II',
    color: 'unit-upgrade',
    prerequisites: ['blue', 'blue', 'yellow'],
    faction: null,
    unitUpgrade: 'dreadnought',
    stats: { move: 2, combat: 5 },
  },
  {
    id: 'war-sun',
    name: 'War Sun',
    color: 'unit-upgrade',
    prerequisites: ['red', 'red', 'red', 'yellow'],
    faction: null,
    unitUpgrade: 'war-sun',
    stats: {},
  },
]

function getTechnology(id) {
  return technologies.find(t => t.id === id)
}

function getAllTechnologies() {
  return [...technologies]
}

function getGenericTechnologies() {
  return technologies.filter(t => !t.faction)
}

function getByColor(color) {
  return technologies.filter(t => t.color === color && !t.faction)
}

function getUnitUpgrades() {
  return technologies.filter(t => t.unitUpgrade)
}

module.exports = {
  technologies,
  getTechnology,
  getAllTechnologies,
  getGenericTechnologies,
  getByColor,
  getUnitUpgrades,
}
