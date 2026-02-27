// Exploration cards for Twilight Imperium: Prophecy of Kings
//
// When a player takes control of a planet not already controlled by another
// player, they draw from the exploration deck matching that planet's trait.
//
// Card types:
//   attach     - Attaches to the planet (permanent bonus)
//   action     - Resolved immediately, then discarded
//   fragment   - Relic fragment, kept by the player
//
// Each deck has 20 cards. Cards with multiple copies use the copies() helper.

function copies(base, count) {
  if (count === 1) {
    return [base]
  }
  return Array.from({ length: count }, (_, i) => ({
    ...base,
    id: `${base.id}-${i + 1}`,
  }))
}

// --- Cultural Exploration (20 cards) ---

const culturalExploration = [
  {
    id: 'demilitarized-zone',
    name: 'Demilitarized Zone',
    trait: 'cultural',
    type: 'attach',
    effect: 'Return all structures on this planet to your reinforcements. Then, return all ground forces on this planet to the space area. ATTACH: Units cannot be committed to, produced on or placed on this planet. During the agenda phase, this planet\'s planet card can be traded as part of a transaction.',
    attachment: { demilitarized: true },
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    trait: 'cultural',
    type: 'attach',
    effect: 'This planet\'s resource value is increased by 2 and its influence value is increased by 1.',
    attachment: { resources: 2, influence: 1 },
  },
  ...copies({
    id: 'freelancers',
    name: 'Freelancers',
    trait: 'cultural',
    type: 'action',
    effect: 'You may produce 1 unit in this system; you may spend influence as if it were resources to produce this unit.',
  }, 3),
  {
    id: 'gamma-wormhole',
    name: 'Gamma Wormhole',
    trait: 'cultural',
    type: 'action',
    purge: true,
    effect: 'Place a gamma wormhole token in this system. Then, purge this card.',
  },
  ...copies({
    id: 'mercenary-outfit',
    name: 'Mercenary Outfit',
    trait: 'cultural',
    type: 'action',
    effect: 'You may place 1 infantry from your reinforcements on this planet.',
  }, 3),
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
    effect: 'This planet\'s influence value is increased by 1.',
    attachment: { influence: 1 },
  },
  ...copies({
    id: 'cultural-relic-fragment',
    name: 'Cultural Relic Fragment',
    trait: 'cultural',
    type: 'fragment',
    fragmentType: 'cultural',
    effect: 'ACTION: Purge 3 of your cultural relic fragments to gain 1 relic.',
  }, 9),
]

// --- Industrial Exploration (20 cards) ---

const industrialExploration = [
  ...copies({
    id: 'abandoned-warehouses',
    name: 'Abandoned Warehouses',
    trait: 'industrial',
    type: 'action',
    effect: 'You may gain 2 commodities, or you may convert up to 2 of your commodities to trade goods.',
  }, 4),
  {
    id: 'biotic-research-facility',
    name: 'Biotic Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet has a green technology specialty; if this planet already has a technology specialty, this planet\'s resource and influence values are each increased by 1 instead.',
    attachment: { techSpecialty: 'green', fallback: { resources: 1, influence: 1 } },
  },
  {
    id: 'cybernetic-research-facility',
    name: 'Cybernetic Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet has a yellow technology specialty; if this planet already has a technology specialty, this planet\'s resource and influence values are each increased by 1 instead.',
    attachment: { techSpecialty: 'yellow', fallback: { resources: 1, influence: 1 } },
  },
  ...copies({
    id: 'functioning-base',
    name: 'Functioning Base',
    trait: 'industrial',
    type: 'action',
    effect: 'You may gain 1 commodity, or you may spend 1 trade good or 1 commodity to draw 1 action card.',
  }, 4),
  ...copies({
    id: 'local-fabricators',
    name: 'Local Fabricators',
    trait: 'industrial',
    type: 'action',
    effect: 'You may gain 1 commodity, or you may spend 1 trade good or 1 commodity to place 1 mech from your reinforcements on this planet.',
  }, 4),
  {
    id: 'propulsion-research-facility',
    name: 'Propulsion Research Facility',
    trait: 'industrial',
    type: 'attach',
    effect: 'This planet has a blue technology specialty; if this planet already has a technology specialty, this planet\'s resource and influence values are each increased by 1 instead.',
    attachment: { techSpecialty: 'blue', fallback: { resources: 1, influence: 1 } },
  },
  ...copies({
    id: 'industrial-relic-fragment',
    name: 'Industrial Relic Fragment',
    trait: 'industrial',
    type: 'fragment',
    fragmentType: 'industrial',
    effect: 'ACTION: Purge 3 of your industrial relic fragments to gain 1 relic.',
  }, 5),
]

// --- Hazardous Exploration (20 cards) ---

const hazardousExploration = [
  ...copies({
    id: 'core-mine',
    name: 'Core Mine',
    trait: 'hazardous',
    type: 'action',
    effect: 'If you have at least 1 mech on this planet, or if you remove 1 infantry from this planet, gain 1 trade good.',
  }, 3),
  ...copies({
    id: 'expedition',
    name: 'Expedition',
    trait: 'hazardous',
    type: 'action',
    effect: 'If you have at least 1 mech on this planet, or if you remove 1 infantry from this planet, ready this planet.',
  }, 3),
  {
    id: 'lazax-survivors',
    name: 'Lazax Survivors',
    trait: 'hazardous',
    type: 'attach',
    effect: 'This planet\'s resource value is increased by 1 and its influence value is increased by 2.',
    attachment: { resources: 1, influence: 2 },
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
  ...copies({
    id: 'volatile-fuel-source',
    name: 'Volatile Fuel Source',
    trait: 'hazardous',
    type: 'action',
    effect: 'If you have at least 1 mech on this planet, or if you remove 1 infantry from this planet, gain 1 command token.',
  }, 3),
  {
    id: 'warfare-research-facility',
    name: 'Warfare Research Facility',
    trait: 'hazardous',
    type: 'attach',
    effect: 'This planet has a red technology specialty; if this planet already has a technology specialty, this planet\'s resource and influence values are each increased by 1 instead.',
    attachment: { techSpecialty: 'red', fallback: { resources: 1, influence: 1 } },
  },
  ...copies({
    id: 'hazardous-relic-fragment',
    name: 'Hazardous Relic Fragment',
    trait: 'hazardous',
    type: 'fragment',
    fragmentType: 'hazardous',
    effect: 'ACTION: Purge 3 of your hazardous relic fragments to gain 1 relic.',
  }, 7),
]

// --- Frontier Exploration (20 cards) ---

const frontierExploration = [
  // Prophecy of Kings (14 cards)
  ...copies({
    id: 'derelict-vessel',
    name: 'Derelict Vessel',
    trait: 'frontier',
    type: 'action',
    effect: 'Draw 1 secret objective.',
  }, 2),
  ...copies({
    id: 'enigmatic-device',
    name: 'Enigmatic Device',
    trait: 'frontier',
    type: 'action',
    persistent: true,
    effect: 'Place this card face up in your play area. ACTION: You may spend 6 resources and purge this card to research 1 technology.',
  }, 2),
  {
    id: 'gamma-relay',
    name: 'Gamma Relay',
    trait: 'frontier',
    type: 'action',
    purge: true,
    effect: 'Place a gamma wormhole token in this system. Then, purge this card.',
  },
  {
    id: 'ion-storm',
    name: 'Ion Storm',
    trait: 'frontier',
    type: 'action',
    persistent: true,
    effect: 'Place the ion storm token in this system with either side face up. Then, place this card in the common play area. At the end of a "Move Ships" or "Retreat" sub-step of a tactical action during which 1 or more of your ships use the ion storm wormhole, flip the ion storm token to its opposing side.',
  },
  ...copies({
    id: 'lost-crew',
    name: 'Lost Crew',
    trait: 'frontier',
    type: 'action',
    effect: 'Draw 2 action cards.',
  }, 2),
  ...copies({
    id: 'merchant-station',
    name: 'Merchant Station',
    trait: 'frontier',
    type: 'action',
    effect: 'You may replenish your commodities, or you may convert your commodities to trade goods.',
  }, 2),
  {
    id: 'mirage',
    name: 'Mirage',
    trait: 'frontier',
    type: 'action',
    purge: true,
    effect: 'Place the Mirage planet token in this system. Gain the Mirage planet card and ready it. Then, purge this card.',
  },
  ...copies({
    id: 'unknown-relic-fragment',
    name: 'Unknown Relic Fragment',
    trait: 'frontier',
    type: 'fragment',
    fragmentType: 'unknown',
    effect: 'This card counts as a relic fragment of any type.',
  }, 3),

  // Codex Volume III: Vigil (6 cards)
  {
    id: 'dead-world',
    name: 'Dead World',
    trait: 'frontier',
    type: 'action',
    expansion: 'codex-iii',
    effect: 'Draw 1 relic.',
  },
  {
    id: 'entropic-field',
    name: 'Entropic Field',
    trait: 'frontier',
    type: 'action',
    expansion: 'codex-iii',
    effect: 'Gain 1 command token and 2 trade goods.',
  },
  ...copies({
    id: 'keleres-ship',
    name: 'Keleres Ship',
    trait: 'frontier',
    type: 'action',
    expansion: 'codex-iii',
    effect: 'Gain 2 command tokens.',
  }, 2),
  {
    id: 'major-entropic-field',
    name: 'Major Entropic Field',
    trait: 'frontier',
    type: 'action',
    expansion: 'codex-iii',
    effect: 'Gain 1 command token and 3 trade goods.',
  },
  {
    id: 'minor-entropic-field',
    name: 'Minor Entropic Field',
    trait: 'frontier',
    type: 'action',
    expansion: 'codex-iii',
    effect: 'Gain 1 command token and 1 trade good.',
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
