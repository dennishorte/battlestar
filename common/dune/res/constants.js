module.exports = {
  // Player counts
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 4,

  // Starting resources per player
  STARTING_WATER: 1,
  STARTING_SOLARI: 0,
  STARTING_SPICE: 0,
  STARTING_AGENTS: 2,
  STARTING_TROOPS_IN_GARRISON: 3,
  STARTING_TROOPS_IN_SUPPLY: 9,
  STARTING_SPIES: 3,

  // Game setup
  HAND_SIZE: 5,
  STARTING_DECK_SIZE: 10,
  IMPERIUM_ROW_SIZE: 5,

  // Conflict deck composition
  CONFLICT_I_COUNT: 1,
  CONFLICT_II_COUNT: 5,
  CONFLICT_III_COUNT: 4,
  CONFLICT_DECK_SIZE: 10,

  // Combat strength values
  TROOP_STRENGTH: 2,
  SANDWORM_STRENGTH: 3,
  SWORD_STRENGTH: 1,

  // Faction names
  FACTIONS: ['emperor', 'guild', 'bene-gesserit', 'fremen'],

  // Faction influence thresholds
  INFLUENCE_VP_THRESHOLD: 2,
  INFLUENCE_BONUS_THRESHOLD: 4,

  // Victory
  VP_TO_WIN: 10,

  // Score track starting position by player count
  STARTING_VP: {
    2: 0,
    3: 0,
    4: 1,
  },

  // Agent icon categories
  AGENT_ICONS: ['green', 'purple', 'yellow'],

  // Faction icons (also valid agent icons for faction board spaces)
  FACTION_ICONS: ['emperor', 'guild', 'bene-gesserit', 'fremen'],

  // Normalize any free-text or alias spelling to the canonical short faction id.
  normalizeFactionId(text) {
    if (!text) {
      return null
    }
    const key = String(text).toLowerCase().trim().replace(/^the\s+/, '')
    const map = {
      'emperor': 'emperor',
      'guild': 'guild',
      'spacing guild': 'guild',
      'bene-gesserit': 'bene-gesserit',
      'bene gesserit': 'bene-gesserit',
      'fremen': 'fremen',
    }
    return map[key] || key
  },

  // Returns array of canonical faction ids for a card whose definition's
  // factionAffiliation may be a string, array, or null/undefined.
  getFactionAffiliations(card) {
    const raw = card?.factionAffiliation ?? card?.definition?.factionAffiliation
    if (!raw) {
      return []
    }
    const list = Array.isArray(raw) ? raw : [raw]
    const out = []
    for (const f of list) {
      const norm = module.exports.normalizeFactionId(f)
      if (norm) {
        out.push(norm)
      }
    }
    return out
  },
}
