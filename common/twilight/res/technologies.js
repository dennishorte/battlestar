// Technology definitions for Twilight Imperium 4th Edition + PoK
//
// Technology attributes:
//   id            - Unique identifier
//   name          - Display name
//   color         - 'blue' | 'red' | 'yellow' | 'green' | 'unit-upgrade' | null (faction)
//   prerequisites - Array of color strings required (e.g., ['blue', 'blue'] needs 2 blue)
//   faction       - Faction ID if faction-specific, null if generic
//   unitUpgrade   - Unit type this upgrades, null if not a unit upgrade
//   description   - Rules text (uses Omega versions where applicable)

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
    description: 'Your ships can move into and through asteroid fields. When other players\' units use SPACE CANNON against your units, apply \u22121 to the result of each die roll.',
  },
  {
    id: 'gravity-drive',
    name: 'Gravity Drive',
    color: 'blue',
    prerequisites: ['blue'],
    faction: null,
    unitUpgrade: null,
    description: 'After you activate a system, apply +1 to the move value of 1 of your ships during this tactical action.',
  },
  {
    id: 'fleet-logistics',
    name: 'Fleet Logistics',
    color: 'blue',
    prerequisites: ['blue', 'blue'],
    faction: null,
    unitUpgrade: null,
    description: 'During each of your turns of the action phase, you may perform 2 actions instead of 1.',
  },
  {
    id: 'light-wave-deflector',
    name: 'Light/Wave Deflector',
    color: 'blue',
    prerequisites: ['blue', 'blue', 'blue'],
    faction: null,
    unitUpgrade: null,
    description: 'Your ships can move through systems that contain other players\' ships.',
  },
  // PoK Blue
  {
    id: 'dark-energy-tap',
    name: 'Dark Energy Tap',
    color: 'blue',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
    description: 'After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token. Your ships can retreat into adjacent systems that do not contain other players\' units, even if you do not have units or control planets in that system.',
  },
  {
    id: 'sling-relay',
    name: 'Sling Relay',
    color: 'blue',
    prerequisites: ['blue'],
    faction: null,
    unitUpgrade: null,
    description: 'ACTION: Exhaust this card to produce 1 ship in any system that contains one of your space docks.',
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
    description: 'When 1 or more of your units use BOMBARDMENT or SPACE CANNON, 1 of those units may roll 1 additional die.',
  },
  {
    id: 'magen-defense-grid',
    name: 'Magen Defense Grid',
    color: 'red',
    prerequisites: ['red'],
    faction: null,
    unitUpgrade: null,
    description: 'When any player activates a system that contains 1 or more of your structures, place 1 infantry from your reinforcements with each of those structures. At the start of ground combat on a planet that contains 1 or more of your structures, produce 1 hit and assign it to 1 of your opponent\'s ground forces.',
  },
  {
    id: 'duranium-armor',
    name: 'Duranium Armor',
    color: 'red',
    prerequisites: ['red', 'red'],
    faction: null,
    unitUpgrade: null,
    description: 'During each combat round, after you assign hits to your units, repair 1 of your damaged units that did not use SUSTAIN DAMAGE during this combat round.',
  },
  {
    id: 'assault-cannon',
    name: 'Assault Cannon',
    color: 'red',
    prerequisites: ['red', 'red', 'red'],
    faction: null,
    unitUpgrade: null,
    description: 'At the start of a space combat in a system that contains 3 or more of your non-fighter ships, your opponent must destroy 1 of their non-fighter ships.',
  },
  // PoK Red
  {
    id: 'ai-development-algorithm',
    name: 'AI Development Algorithm',
    color: 'red',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
    description: 'When you research a unit upgrade technology, you may exhaust this card to ignore any 1 prerequisite. When 1 or more of your units use PRODUCTION, you may exhaust this card to reduce the combined cost of the produced units by the number of unit upgrade technologies that you own.',
  },
  {
    id: 'self-assembly-routines',
    name: 'Self Assembly Routines',
    color: 'red',
    prerequisites: ['red'],
    faction: null,
    unitUpgrade: null,
    description: 'After 1 or more of your units use PRODUCTION, you may exhaust this card to place 1 mech from your reinforcements on a planet you control in that system. After 1 of your mechs is destroyed, gain 1 trade good.',
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
    description: 'When 1 or more of your units use PRODUCTION, reduce the combined cost of the produced units by 1.',
  },
  {
    id: 'graviton-laser-system',
    name: 'Graviton Laser System',
    color: 'yellow',
    prerequisites: ['yellow'],
    faction: null,
    unitUpgrade: null,
    description: 'You may exhaust this card before 1 or more of your units uses SPACE CANNON; hits produced by those units must be assigned to non-fighter ships if able.',
  },
  {
    id: 'transit-diodes',
    name: 'Transit Diodes',
    color: 'yellow',
    prerequisites: ['yellow', 'yellow'],
    faction: null,
    unitUpgrade: null,
    description: 'You may exhaust this card at the start of your turn during the action phase; remove up to 4 of your ground forces from the game board and place them on 1 or more planets you control.',
  },
  {
    id: 'integrated-economy',
    name: 'Integrated Economy',
    color: 'yellow',
    prerequisites: ['yellow', 'yellow', 'yellow'],
    faction: null,
    unitUpgrade: null,
    description: 'After you gain control of a planet, you may produce any number of units on that planet that have a combined cost equal to or less than that planet\'s resource value.',
  },
  // PoK Yellow
  {
    id: 'scanlink-drone-network',
    name: 'Scanlink Drone Network',
    color: 'yellow',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
    description: 'When you activate a system, you may explore 1 planet in that system which contains 1 or more of your units.',
  },
  {
    id: 'predictive-intelligence',
    name: 'Predictive Intelligence',
    color: 'yellow',
    prerequisites: ['yellow'],
    faction: null,
    unitUpgrade: null,
    description: 'At the end of your turn, you may exhaust this card to redistribute your command tokens. When you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card.',
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
    description: 'During the status phase, draw 2 action cards instead of 1.',
  },
  {
    id: 'dacxive-animators',
    name: 'Dacxive Animators',
    color: 'green',
    prerequisites: ['green'],
    faction: null,
    unitUpgrade: null,
    description: 'After you win a ground combat, you may place 1 infantry from your reinforcements on that planet.',
  },
  {
    id: 'hyper-metabolism',
    name: 'Hyper Metabolism',
    color: 'green',
    prerequisites: ['green', 'green'],
    faction: null,
    unitUpgrade: null,
    description: 'During the status phase, gain 3 command tokens instead of 2.',
  },
  {
    id: 'x89-bacterial-weapon',
    name: 'X-89 Bacterial Weapon',
    color: 'green',
    prerequisites: ['green', 'green', 'green'],
    faction: null,
    unitUpgrade: null,
    description: 'Double the hits produced by your units\' BOMBARDMENT and ground combat rolls. Exhaust each planet you use BOMBARDMENT against.',
  },
  // PoK Green
  {
    id: 'psychoarchaeology',
    name: 'Psychoarchaeology',
    color: 'green',
    prerequisites: [],
    faction: null,
    unitUpgrade: null,
    description: 'You can use technology specialties on planets you control without exhausting them, even if those planets are exhausted. During the action phase, you can exhaust planets you control that have technology specialties to gain 1 trade good.',
  },
  {
    id: 'bio-stims',
    name: 'Bio-Stims',
    color: 'green',
    prerequisites: ['green'],
    faction: null,
    unitUpgrade: null,
    description: 'You may exhaust this card at the end of your turn to ready 1 of your planets that has a technology specialty or 1 of your other technologies.',
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
    stats: { cost: 1, costFor: 2, combat: 7 },
    description: 'After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.',
  },
  {
    id: 'fighter-ii',
    name: 'Fighter II',
    color: 'unit-upgrade',
    prerequisites: ['green', 'green'],
    faction: null,
    unitUpgrade: 'fighter',
    stats: { cost: 1, costFor: 2, combat: 8, move: 2, requiresCapacity: false },
    description: 'This unit may move without being transported. Fighters in excess of your ships\' capacity count against your fleet pool.',
  },
  {
    id: 'pds-ii',
    name: 'PDS II',
    color: 'unit-upgrade',
    prerequisites: ['yellow', 'red'],
    faction: null,
    unitUpgrade: 'pds',
    stats: { abilities: ['space-cannon-5x1', 'planetary-shield'] },
    description: 'This unit can use its Space Cannon ability against ships that are in adjacent systems.',
  },
  {
    id: 'space-dock-ii',
    name: 'Space Dock II',
    color: 'unit-upgrade',
    prerequisites: ['yellow', 'yellow'],
    faction: null,
    unitUpgrade: 'space-dock',
    stats: { productionValue: 4 },
    description: 'Up to 3 fighters in this system do not count against your ships\' capacity.',
  },
  {
    id: 'carrier-ii',
    name: 'Carrier II',
    color: 'unit-upgrade',
    prerequisites: ['blue', 'blue'],
    faction: null,
    unitUpgrade: 'carrier',
    stats: { cost: 3, combat: 9, move: 2, capacity: 6 },
  },
  {
    id: 'cruiser-ii',
    name: 'Cruiser II',
    color: 'unit-upgrade',
    prerequisites: ['green', 'yellow', 'red'],
    faction: null,
    unitUpgrade: 'cruiser',
    stats: { cost: 2, combat: 6, move: 3, capacity: 1 },
  },
  {
    id: 'destroyer-ii',
    name: 'Destroyer II',
    color: 'unit-upgrade',
    prerequisites: ['red', 'red'],
    faction: null,
    unitUpgrade: 'destroyer',
    stats: { cost: 1, combat: 8, move: 2, abilities: ['anti-fighter-barrage-6x3'] },
  },
  {
    id: 'dreadnought-ii',
    name: 'Dreadnought II',
    color: 'unit-upgrade',
    prerequisites: ['blue', 'blue', 'yellow'],
    faction: null,
    unitUpgrade: 'dreadnought',
    stats: { cost: 4, combat: 5, move: 2, capacity: 1, bombardment: 5, abilities: ['sustain-damage'] },
  },
  {
    id: 'war-sun',
    name: 'War Sun',
    color: 'unit-upgrade',
    prerequisites: ['red', 'red', 'red', 'yellow'],
    faction: null,
    unitUpgrade: 'war-sun',
    stats: { cost: 12, combat: 3, combatCount: 3, move: 2, capacity: 6, bombardment: 3, bombardmentCount: 3, abilities: ['sustain-damage'] },
    description: 'Other players\' units in this system lose PLANETARY SHIELD.',
  },
]

function getTechnology(id) {
  const generic = technologies.find(t => t.id === id)
  if (generic) {
    return generic
  }

  // Search faction technologies
  const factions = require('./factions/index.js')
  for (const faction of factions.getAllFactions()) {
    if (faction.factionTechnologies) {
      const factionTech = faction.factionTechnologies.find(t => t.id === id)
      if (factionTech) {
        return factionTech
      }
    }
  }
  return null
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
