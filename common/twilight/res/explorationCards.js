// Exploration cards for Twilight Imperium: Prophecy of Kings
//
// When a player takes control of a planet not already controlled by another
// player, they draw from the exploration deck matching that planet's trait.
//
// Card types:
//   attach     - Attaches to the planet (permanent bonus)
//   action     - Immediate effect, then discarded
//   fragment   - Relic fragment, kept by the player

const culturalExploration = [
  {
    id: 'demilitarized-zone',
    name: 'Demilitarized Zone',
    trait: 'cultural',
    type: 'attach',
    effect: 'This planet has PRODUCTION 1 and gains the CULTURAL trait.',
    attachment: { production: 1 },
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    trait: 'cultural',
    type: 'attach',
    effect: 'This planet\'s resource value is increased by 2.',
    attachment: { resources: 2 },
  },
  {
    id: 'paradise-world',
    name: 'Paradise World',
    trait: 'cultural',
    type: 'attach',
    effect: 'This planet\'s influence value is increased by 2.',
    attachment: { influence: 2 },
  },
  {
    id: 'tomb-of-emphidia',
    name: 'Tomb of Emphidia',
    trait: 'cultural',
    type: 'attach',
    effect: 'This planet\'s influence value is increased by 1. Gain 1 relic fragment.',
    attachment: { influence: 1 },
  },
  {
    id: 'cultural-relic-fragment-1',
    name: 'Cultural Relic Fragment',
    trait: 'cultural',
    type: 'fragment',
    fragmentType: 'cultural',
    effect: 'Relic fragment. Purge 3 cultural fragments to gain 1 relic.',
  },
  {
    id: 'cultural-relic-fragment-2',
    name: 'Cultural Relic Fragment',
    trait: 'cultural',
    type: 'fragment',
    fragmentType: 'cultural',
    effect: 'Relic fragment. Purge 3 cultural fragments to gain 1 relic.',
  },
  {
    id: 'cultural-relic-fragment-3',
    name: 'Cultural Relic Fragment',
    trait: 'cultural',
    type: 'fragment',
    fragmentType: 'cultural',
    effect: 'Relic fragment. Purge 3 cultural fragments to gain 1 relic.',
  },
  {
    id: 'freelancers',
    name: 'Freelancers',
    trait: 'cultural',
    type: 'action',
    effect: 'Gain 1 trade good.',
    resolve: (player) => {
      player.tradeGoods += 1
    },
  },
  {
    id: 'gamma-wormhole',
    name: 'Gamma Wormhole',
    trait: 'cultural',
    type: 'attach',
    effect: 'This system now contains a gamma wormhole.',
    attachment: { wormhole: 'gamma' },
  },
  {
    id: 'mercenary-outfit',
    name: 'Mercenary Outfit',
    trait: 'cultural',
    type: 'action',
    effect: 'Gain 1 trade good.',
    resolve: (player) => {
      player.tradeGoods += 1
    },
  },
]

const hazardousExploration = [
  {
    id: 'expedition',
    name: 'Expedition',
    trait: 'hazardous',
    type: 'action',
    effect: 'Gain 2 trade goods.',
    resolve: (player) => {
      player.tradeGoods += 2
    },
  },
  {
    id: 'volatile-fuel-source',
    name: 'Volatile Fuel Source',
    trait: 'hazardous',
    type: 'action',
    effect: 'Gain 2 trade goods.',
    resolve: (player) => {
      player.tradeGoods += 2
    },
  },
  {
    id: 'mining-world',
    name: 'Mining World',
    trait: 'hazardous',
    type: 'attach',
    effect: 'This planet\'s resource value is increased by 2.',
    attachment: { resources: 2 },
  },
  {
    id: 'rich-world',
    name: 'Rich World',
    trait: 'hazardous',
    type: 'attach',
    effect: 'This planet\'s resource value is increased by 1.',
    attachment: { resources: 1 },
  },
  {
    id: 'hazardous-relic-fragment-1',
    name: 'Hazardous Relic Fragment',
    trait: 'hazardous',
    type: 'fragment',
    fragmentType: 'hazardous',
    effect: 'Relic fragment. Purge 3 hazardous fragments to gain 1 relic.',
  },
  {
    id: 'hazardous-relic-fragment-2',
    name: 'Hazardous Relic Fragment',
    trait: 'hazardous',
    type: 'fragment',
    fragmentType: 'hazardous',
    effect: 'Relic fragment. Purge 3 hazardous fragments to gain 1 relic.',
  },
  {
    id: 'hazardous-relic-fragment-3',
    name: 'Hazardous Relic Fragment',
    trait: 'hazardous',
    type: 'fragment',
    fragmentType: 'hazardous',
    effect: 'Relic fragment. Purge 3 hazardous fragments to gain 1 relic.',
  },
  {
    id: 'warfare-research-facility',
    name: 'Warfare Research Facility',
    trait: 'hazardous',
    type: 'attach',
    effect: 'This planet gains a red tech specialty.',
    attachment: { techSpecialty: 'red' },
  },
  {
    id: 'lazax-survivors',
    name: 'Lazax Survivors',
    trait: 'hazardous',
    type: 'action',
    effect: 'Gain 1 infantry on this planet.',
  },
  {
    id: 'functioning-base',
    name: 'Functioning Base',
    trait: 'hazardous',
    type: 'action',
    effect: 'Gain 1 commodity.',
    resolve: (player) => {
      player.commodities += 1
    },
  },
]

const industrialExploration = [
  {
    id: 'biotic-research-facility',
    name: 'Biotic Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet gains a green tech specialty.',
    attachment: { techSpecialty: 'green' },
  },
  {
    id: 'cybernetics-research-facility',
    name: 'Cybernetics Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet gains a yellow tech specialty.',
    attachment: { techSpecialty: 'yellow' },
  },
  {
    id: 'propulsion-research-facility',
    name: 'Propulsion Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet gains a blue tech specialty.',
    attachment: { techSpecialty: 'blue' },
  },
  {
    id: 'industrial-relic-fragment-1',
    name: 'Industrial Relic Fragment',
    trait: 'industrial',
    type: 'fragment',
    fragmentType: 'industrial',
    effect: 'Relic fragment. Purge 3 industrial fragments to gain 1 relic.',
  },
  {
    id: 'industrial-relic-fragment-2',
    name: 'Industrial Relic Fragment',
    trait: 'industrial',
    type: 'fragment',
    fragmentType: 'industrial',
    effect: 'Relic fragment. Purge 3 industrial fragments to gain 1 relic.',
  },
  {
    id: 'industrial-relic-fragment-3',
    name: 'Industrial Relic Fragment',
    trait: 'industrial',
    type: 'fragment',
    fragmentType: 'industrial',
    effect: 'Relic fragment. Purge 3 industrial fragments to gain 1 relic.',
  },
  {
    id: 'core-mine',
    name: 'Core Mine',
    trait: 'industrial',
    type: 'action',
    effect: 'Gain 1 trade good.',
    resolve: (player) => {
      player.tradeGoods += 1
    },
  },
  {
    id: 'local-fabricators',
    name: 'Local Fabricators',
    trait: 'industrial',
    type: 'action',
    effect: 'Gain 1 commodity.',
    resolve: (player) => {
      player.commodities += 1
    },
  },
  {
    id: 'abandoned-warehouses',
    name: 'Abandoned Warehouses',
    trait: 'industrial',
    type: 'action',
    effect: 'Gain 2 commodities.',
    resolve: (player) => {
      player.commodities += 2
    },
  },
  {
    id: 'agency-supply-depot',
    name: 'Agency Supply Depot',
    trait: 'industrial',
    type: 'action',
    effect: 'Gain 2 trade goods.',
    resolve: (player) => {
      player.tradeGoods += 2
    },
  },
]

const frontierExploration = [
  {
    id: 'derelict-vessel',
    name: 'Derelict Vessel',
    trait: 'frontier',
    type: 'action',
    effect: 'Draw 2 action cards.',
  },
  {
    id: 'enigmatic-device',
    name: 'Enigmatic Device',
    trait: 'frontier',
    type: 'action',
    effect: 'Gain 2 trade goods.',
    resolve: (player) => {
      player.tradeGoods += 2
    },
  },
  {
    id: 'gamma-relay',
    name: 'Gamma Relay',
    trait: 'frontier',
    type: 'action',
    effect: 'Place a gamma wormhole in this system.',
  },
  {
    id: 'ion-storm',
    name: 'Ion Storm',
    trait: 'frontier',
    type: 'action',
    effect: 'Place the Ion Storm token in this or an adjacent system with your ships.',
  },
  {
    id: 'lost-crew',
    name: 'Lost Crew',
    trait: 'frontier',
    type: 'action',
    effect: 'Draw 2 action cards.',
  },
  {
    id: 'merchant-station',
    name: 'Merchant Station',
    trait: 'frontier',
    type: 'action',
    effect: 'Gain 2 trade goods.',
    resolve: (player) => {
      player.tradeGoods += 2
    },
  },
  {
    id: 'mirage',
    name: 'Mirage',
    trait: 'frontier',
    type: 'attach',
    effect: 'This system gains a planet: Mirage (1/2).',
  },
  {
    id: 'unknown-relic-fragment-1',
    name: 'Unknown Relic Fragment',
    trait: 'frontier',
    type: 'fragment',
    fragmentType: 'unknown',
    effect: 'Relic fragment. Can substitute for any type of fragment.',
  },
  {
    id: 'unknown-relic-fragment-2',
    name: 'Unknown Relic Fragment',
    trait: 'frontier',
    type: 'fragment',
    fragmentType: 'unknown',
    effect: 'Relic fragment. Can substitute for any type of fragment.',
  },
  {
    id: 'unknown-relic-fragment-3',
    name: 'Unknown Relic Fragment',
    trait: 'frontier',
    type: 'fragment',
    fragmentType: 'unknown',
    effect: 'Relic fragment. Can substitute for any type of fragment.',
  },
]

function getExplorationCards(trait) {
  switch (trait) {
    case 'cultural': return [...culturalExploration]
    case 'hazardous': return [...hazardousExploration]
    case 'industrial': return [...industrialExploration]
    case 'frontier': return [...frontierExploration]
    default: return []
  }
}

function getExplorationCard(id) {
  const all = [
    ...culturalExploration,
    ...hazardousExploration,
    ...industrialExploration,
    ...frontierExploration,
  ]
  return all.find(c => c.id === id)
}

function getAllExplorationCards() {
  return [
    ...culturalExploration,
    ...hazardousExploration,
    ...industrialExploration,
    ...frontierExploration,
  ]
}

module.exports = {
  getExplorationCards,
  getExplorationCard,
  getAllExplorationCards,
}
