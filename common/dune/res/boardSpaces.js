// Board space definitions for Dune Imperium: Uprising.
// Icon colors map to card agentIcons: purple (city), yellow (desert/spice), green (Landsraad).
// Faction spaces use faction name as icon and grant influence when visited.

const boardSpaces = [
  // ── City spaces (purple) ───────────────────────────────────────────
  {
    id: 'arrakeen',
    name: 'Arrakeen',
    icon: 'purple',
    isCombatSpace: true,
    isProtected: true,
    controlBonus: { resource: 'solari', amount: 1 },
    effects: [
      { type: 'troop', amount: 1 },
      { type: 'draw', amount: 1 },
    ],
  },
  {
    id: 'spice-refinery',
    name: 'Spice Refinery',
    icon: 'purple',
    isCombatSpace: true,
    isProtected: true,
    controlBonus: { resource: 'solari', amount: 1 },
    effects: [
      // Choice: gain 2 solari OR pay 1 spice -> gain 4 solari
      { type: 'choice', choices: [
        { label: 'Gain 2 Solari', effects: [{ type: 'gain', resource: 'solari', amount: 2 }] },
        { label: 'Pay 1 Spice, gain 4 Solari', cost: { spice: 1 }, effects: [{ type: 'gain', resource: 'solari', amount: 4 }] },
      ]},
    ],
  },
  {
    id: 'research-station',
    name: 'Research Station',
    icon: 'purple',
    cost: { water: 2 },
    isCombatSpace: true,
    effects: [
      { type: 'troop', amount: 2 },
      { type: 'draw', amount: 2 },
    ],
  },
  {
    id: 'sietch-tabr',
    name: 'Sietch Tabr',
    icon: 'purple',
    influenceRequirement: { faction: 'fremen', amount: 2 },
    isCombatSpace: true,
    effects: [
      // Choice: (maker hook + 1 troop + 1 water) OR (1 water + break shield wall)
      { type: 'choice', choices: [
        { label: 'Maker hook, 1 troop, 1 water', effects: [
          { type: 'maker-hook' },
          { type: 'troop', amount: 1 },
          { type: 'gain', resource: 'water', amount: 1 },
        ]},
        { label: '1 water, break Shield Wall', effects: [
          { type: 'gain', resource: 'water', amount: 1 },
          { type: 'break-shield-wall' },
        ]},
      ]},
    ],
  },

  // ── Desert/Spice spaces (yellow) ──────────────────────────────────
  {
    id: 'imperial-basin',
    name: 'Imperial Basin',
    icon: 'yellow',
    isCombatSpace: true,
    isMakerSpace: true,
    isProtected: true,
    controlBonus: { resource: 'spice', amount: 1 },
    effects: [
      { type: 'spice-harvest', amount: 1 },
    ],
  },
  {
    id: 'hagga-basin',
    name: 'Hagga Basin',
    icon: 'yellow',
    cost: { water: 1 },
    isCombatSpace: true,
    isMakerSpace: true,
    effects: [
      // Gain 2 spice OR (if maker hook: get a sandworm). Plus bonus spice.
      { type: 'choice', choices: [
        { label: 'Gain 2 Spice', effects: [{ type: 'spice-harvest', amount: 2 }] },
        { label: 'Maker hook: get a Sandworm', requires: 'maker-hook', effects: [{ type: 'sandworm', amount: 1 }, { type: 'spice-harvest', amount: 0 }] },
      ]},
    ],
  },
  {
    id: 'deep-desert',
    name: 'Deep Desert',
    icon: 'yellow',
    cost: { water: 3 },
    isCombatSpace: true,
    isMakerSpace: true,
    effects: [
      // Gain 4 spice OR (if maker hook: get 2 sandworms). Plus bonus spice.
      { type: 'choice', choices: [
        { label: 'Gain 4 Spice', effects: [{ type: 'spice-harvest', amount: 4 }] },
        { label: 'Maker hook: get 2 Sandworms', requires: 'maker-hook', effects: [{ type: 'sandworm', amount: 2 }, { type: 'spice-harvest', amount: 0 }] },
      ]},
    ],
  },
  {
    id: 'accept-contract',
    name: 'Accept Contract',
    icon: 'yellow',
    effects: [
      { type: 'contract' },
      { type: 'draw', amount: 1 },
    ],
  },
  {
    id: 'shipping',
    name: 'Shipping',
    icon: 'yellow',
    influenceRequirement: { faction: 'guild', amount: 2 },
    cost: { spice: 3 },
    effects: [
      { type: 'gain', resource: 'solari', amount: 5 },
      { type: 'influence-choice', amount: 1 },
    ],
  },

  // ── Landsraad spaces (green) ──────────────────────────────────────
  {
    id: 'high-council',
    name: 'High Council',
    icon: 'green',
    cost: { solari: 5 },
    effects: [
      // 1st time: gain a seat on the high council
      // 2nd time+: gain 2 spice, draw 1 intrigue, gain 3 troops
      { type: 'high-council' },
    ],
  },
  {
    id: 'imperial-privilege',
    name: 'Imperial Privilege',
    icon: 'green',
    influenceRequirement: { faction: 'emperor', amount: 2 },
    cost: { solari: 3 },
    effects: [
      // Trash an intrigue card -> draw an intrigue card. Return an agent. Draw a card.
      { type: 'intrigue-trash-draw' },
      { type: 'recall-agent' },
      { type: 'draw', amount: 1 },
    ],
  },
  {
    id: 'sword-master',
    name: 'Sword Master',
    icon: 'green',
    cost: { solari: 8 },
    effects: [
      // Gain your third agent. Cost drops to 6 after first player buys.
      { type: 'sword-master' },
    ],
  },
  {
    id: 'assembly-hall',
    name: 'Assembly Hall',
    icon: 'green',
    effects: [
      { type: 'intrigue', amount: 1 },
      { type: 'gain', resource: 'persuasion', amount: 1 },
    ],
  },
  {
    id: 'gather-support',
    name: 'Gather Support',
    icon: 'green',
    effects: [
      // Gain 2 troops OR pay 2 solari -> gain 2 troops and 1 water
      { type: 'choice', choices: [
        { label: 'Gain 2 troops', effects: [{ type: 'troop', amount: 2 }] },
        { label: 'Pay 2 Solari for 2 troops and 1 water', cost: { solari: 2 }, effects: [
          { type: 'troop', amount: 2 },
          { type: 'gain', resource: 'water', amount: 1 },
        ]},
      ]},
    ],
  },

  // ── Emperor spaces ────────────────────────────────────────────────
  {
    id: 'sardaukar',
    name: 'Sardaukar',
    icon: 'emperor',
    faction: 'emperor',
    cost: { spice: 4 },
    effects: [
      { type: 'intrigue', amount: 1 },
      { type: 'troop', amount: 4 },
    ],
  },
  {
    id: 'dutiful-service',
    name: 'Dutiful Service',
    icon: 'emperor',
    faction: 'emperor',
    effects: [
      { type: 'contract' },
    ],
  },

  // ── Spacing Guild spaces ──────────────────────────────────────────
  {
    id: 'heighliner',
    name: 'Heighliner',
    icon: 'guild',
    faction: 'guild',
    cost: { spice: 5 },
    isCombatSpace: true,
    effects: [
      { type: 'troop', amount: 5 },
    ],
  },
  {
    id: 'deliver-supplies',
    name: 'Deliver Supplies',
    icon: 'guild',
    faction: 'guild',
    effects: [
      { type: 'gain', resource: 'water', amount: 1 },
    ],
  },

  // ── Bene Gesserit spaces ──────────────────────────────────────────
  {
    id: 'espionage',
    name: 'Espionage',
    icon: 'bene-gesserit',
    faction: 'bene-gesserit',
    cost: { spice: 1 },
    effects: [
      { type: 'draw', amount: 1 },
      { type: 'spy' },
    ],
  },
  {
    id: 'secrets',
    name: 'Secrets',
    icon: 'bene-gesserit',
    faction: 'bene-gesserit',
    effects: [
      { type: 'intrigue', amount: 1 },
      // Steal a random intrigue card from each player with 4+ intrigue cards
      { type: 'steal-intrigue' },
    ],
  },

  // ── Fremen spaces ─────────────────────────────────────────────────
  {
    id: 'desert-tactics',
    name: 'Desert Tactics',
    icon: 'fremen',
    faction: 'fremen',
    cost: { water: 1 },
    isCombatSpace: true,
    effects: [
      { type: 'troop', amount: 1 },
      { type: 'trash-card' },
    ],
  },
  {
    id: 'fremkit',
    name: 'Fremkit',
    icon: 'fremen',
    faction: 'fremen',
    isCombatSpace: true,
    effects: [
      { type: 'draw', amount: 1 },
    ],
  },
]

module.exports = boardSpaces
