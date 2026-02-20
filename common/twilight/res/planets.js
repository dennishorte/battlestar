// Planet definitions for Twilight Imperium 4th Edition + PoK
//
// Planet attributes:
//   id            - Unique identifier
//   name          - Display name
//   resources     - Resource value (used for production/cost payment)
//   influence     - Influence value (used for voting)
//   trait         - 'cultural' | 'hazardous' | 'industrial' | null (for home/Mecatol)
//   techSpecialty - 'blue' | 'red' | 'yellow' | 'green' | null
//   legendary     - Boolean, whether this is a legendary planet
//   systemId      - System tile ID this planet belongs to

const planets = {
  // ============================================================
  // Mecatol Rex (Tile 18)
  // ============================================================
  'mecatol-rex': {
    id: 'mecatol-rex', name: 'Mecatol Rex',
    resources: 1, influence: 6, trait: null,
    techSpecialty: null, legendary: false, systemId: 18,
  },

  // ============================================================
  // Home System Planets — Base Game
  // ============================================================

  // Tile 1 — Federation of Sol
  'jord': {
    id: 'jord', name: 'Jord',
    resources: 4, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'sol-home',
  },

  // Tile 2 — Mentak Coalition
  'moll-primus': {
    id: 'moll-primus', name: 'Moll Primus',
    resources: 4, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'mentak-home',
  },

  // Tile 3 — Yin Brotherhood
  'darien': {
    id: 'darien', name: 'Darien',
    resources: 4, influence: 4, trait: null,
    techSpecialty: null, legendary: false, systemId: 'yin-home',
  },

  // Tile 4 — Embers of Muaat
  'muaat': {
    id: 'muaat', name: 'Muaat',
    resources: 4, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'muaat-home',
  },

  // Tile 5 — Arborec
  'nestphar': {
    id: 'nestphar', name: 'Nestphar',
    resources: 3, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'arborec-home',
  },

  // Tile 6 — L1Z1X Mindnet
  '0-0-0': {
    id: '0-0-0', name: '[0.0.0]',
    resources: 5, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'l1z1x-home',
  },

  // Tile 7 — Winnu
  'winnu': {
    id: 'winnu', name: 'Winnu',
    resources: 3, influence: 4, trait: null,
    techSpecialty: null, legendary: false, systemId: 'winnu-home',
  },

  // Tile 8 — Nekro Virus
  'mordai-ii': {
    id: 'mordai-ii', name: 'Mordai II',
    resources: 4, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'nekro-home',
  },

  // Tile 9 — Naalu Collective
  'maaluuk': {
    id: 'maaluuk', name: 'Maaluuk',
    resources: 0, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'naalu-home',
  },
  'druaa': {
    id: 'druaa', name: 'Druaa',
    resources: 3, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'naalu-home',
  },

  // Tile 10 — Barony of Letnev
  'arc-prime': {
    id: 'arc-prime', name: 'Arc Prime',
    resources: 4, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'letnev-home',
  },
  'wren-terra': {
    id: 'wren-terra', name: 'Wren Terra',
    resources: 2, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'letnev-home',
  },

  // Tile 11 — Clan of Saar
  'lisis-ii': {
    id: 'lisis-ii', name: 'Lisis II',
    resources: 1, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'saar-home',
  },
  'ragh': {
    id: 'ragh', name: 'Ragh',
    resources: 2, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'saar-home',
  },

  // Tile 12 — Universities of Jol-Nar
  'nar': {
    id: 'nar', name: 'Nar',
    resources: 2, influence: 3, trait: null,
    techSpecialty: null, legendary: false, systemId: 'jolnar-home',
  },
  'jol': {
    id: 'jol', name: 'Jol',
    resources: 1, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'jolnar-home',
  },

  // Tile 13 — Sardakk N'orr
  'trenlak': {
    id: 'trenlak', name: "Tren'lak",
    resources: 1, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'norr-home',
  },
  'quinarra': {
    id: 'quinarra', name: 'Quinarra',
    resources: 3, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'norr-home',
  },

  // Tile 14 — Xxcha Kingdom
  'archon-ren': {
    id: 'archon-ren', name: 'Archon Ren',
    resources: 2, influence: 3, trait: null,
    techSpecialty: null, legendary: false, systemId: 'xxcha-home',
  },
  'archon-tau': {
    id: 'archon-tau', name: 'Archon Tau',
    resources: 1, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'xxcha-home',
  },

  // Tile 15 — Yssaril Tribes
  'retillion': {
    id: 'retillion', name: 'Retillion',
    resources: 2, influence: 3, trait: null,
    techSpecialty: null, legendary: false, systemId: 'yssaril-home',
  },
  'shalloq': {
    id: 'shalloq', name: 'Shalloq',
    resources: 1, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'yssaril-home',
  },

  // Tile 16 — Emirates of Hacan
  'arretze': {
    id: 'arretze', name: 'Arretze',
    resources: 2, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'hacan-home',
  },
  'hercant': {
    id: 'hercant', name: 'Hercant',
    resources: 1, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'hacan-home',
  },
  'kamdorn': {
    id: 'kamdorn', name: 'Kamdorn',
    resources: 0, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'hacan-home',
  },

  // Tile 17/51 — Ghosts of Creuss
  'creuss': {
    id: 'creuss', name: 'Creuss',
    resources: 4, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'creuss-home',
  },

  // ============================================================
  // Home System Planets — Prophecy of Kings
  // ============================================================

  // Tile 52 — Mahact Gene-Sorcerers
  'ixth': {
    id: 'ixth', name: 'Ixth',
    resources: 3, influence: 5, trait: null,
    techSpecialty: null, legendary: false, systemId: 'mahact-home',
  },

  // Tile 53 — Nomad
  'arcturus': {
    id: 'arcturus', name: 'Arcturus',
    resources: 4, influence: 4, trait: null,
    techSpecialty: null, legendary: false, systemId: 'nomad-home',
  },

  // Tile 54 — Vuil'raith Cabal
  'acheron': {
    id: 'acheron', name: 'Acheron',
    resources: 4, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'cabal-home',
  },

  // Tile 55 — Titans of Ul
  'elysium': {
    id: 'elysium', name: 'Elysium',
    resources: 4, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'titans-home',
  },

  // Tile 56 — Empyrean
  'the-dark': {
    id: 'the-dark', name: 'The Dark',
    resources: 3, influence: 4, trait: null,
    techSpecialty: null, legendary: false, systemId: 'empyrean-home',
  },

  // Tile 57 — Naaz-Rokha Alliance
  'naazir': {
    id: 'naazir', name: 'Naazir',
    resources: 2, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'naazrokha-home',
  },
  'rokha': {
    id: 'rokha', name: 'Rokha',
    resources: 1, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'naazrokha-home',
  },

  // Tile 58 — Argent Flight
  'valk': {
    id: 'valk', name: 'Valk',
    resources: 2, influence: 0, trait: null,
    techSpecialty: null, legendary: false, systemId: 'argent-home',
  },
  'avar': {
    id: 'avar', name: 'Avar',
    resources: 1, influence: 1, trait: null,
    techSpecialty: null, legendary: false, systemId: 'argent-home',
  },
  'ylir': {
    id: 'ylir', name: 'Ylir',
    resources: 0, influence: 2, trait: null,
    techSpecialty: null, legendary: false, systemId: 'argent-home',
  },

  // ============================================================
  // Blue Tiles — Base Game Single Planet
  // ============================================================

  // Tile 19
  'wellon': {
    id: 'wellon', name: 'Wellon',
    resources: 1, influence: 2, trait: 'industrial',
    techSpecialty: 'yellow', legendary: false, systemId: 19,
  },
  // Tile 20
  'vefut-ii': {
    id: 'vefut-ii', name: 'Vefut II',
    resources: 2, influence: 2, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 20,
  },
  // Tile 21
  'thibah': {
    id: 'thibah', name: 'Thibah',
    resources: 1, influence: 1, trait: 'industrial',
    techSpecialty: 'blue', legendary: false, systemId: 21,
  },
  // Tile 22
  'tarmann': {
    id: 'tarmann', name: "Tar'Mann",
    resources: 1, influence: 1, trait: 'industrial',
    techSpecialty: 'green', legendary: false, systemId: 22,
  },
  // Tile 23
  'saudor': {
    id: 'saudor', name: 'Saudor',
    resources: 2, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 23,
  },
  // Tile 24
  'mehar-xull': {
    id: 'mehar-xull', name: 'Mehar Xull',
    resources: 1, influence: 3, trait: 'hazardous',
    techSpecialty: 'blue', legendary: false, systemId: 24,
  },
  // Tile 25
  'quann': {
    id: 'quann', name: 'Quann',
    resources: 2, influence: 1, trait: 'cultural',
    techSpecialty: 'yellow', legendary: false, systemId: 25,
  },
  // Tile 26
  'lodor': {
    id: 'lodor', name: 'Lodor',
    resources: 3, influence: 1, trait: 'cultural',
    techSpecialty: 'green', legendary: false, systemId: 26,
  },

  // ============================================================
  // Blue Tiles — Base Game Two Planets
  // ============================================================

  // Tile 27
  'new-albion': {
    id: 'new-albion', name: 'New Albion',
    resources: 1, influence: 1, trait: 'industrial',
    techSpecialty: 'green', legendary: false, systemId: 27,
  },
  'starpoint': {
    id: 'starpoint', name: 'Starpoint',
    resources: 3, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 27,
  },
  // Tile 28
  'tequ-ran': {
    id: 'tequ-ran', name: "Tequ'ran",
    resources: 2, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 28,
  },
  'torkan': {
    id: 'torkan', name: 'Torkan',
    resources: 0, influence: 3, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 28,
  },
  // Tile 29
  'qucenn': {
    id: 'qucenn', name: "Qucen'n",
    resources: 1, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 29,
  },
  'rarron': {
    id: 'rarron', name: 'Rarron',
    resources: 0, influence: 3, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 29,
  },
  // Tile 30
  'mellon': {
    id: 'mellon', name: 'Mellon',
    resources: 0, influence: 2, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 30,
  },
  'zohbat': {
    id: 'zohbat', name: 'Zohbat',
    resources: 3, influence: 1, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 30,
  },
  // Tile 31
  'lazar': {
    id: 'lazar', name: 'Lazar',
    resources: 1, influence: 0, trait: 'industrial',
    techSpecialty: 'yellow', legendary: false, systemId: 31,
  },
  'sakulag': {
    id: 'sakulag', name: 'Sakulag',
    resources: 2, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 31,
  },
  // Tile 32
  'dal-bootha': {
    id: 'dal-bootha', name: 'Dal Bootha',
    resources: 0, influence: 2, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 32,
  },
  'xxehan': {
    id: 'xxehan', name: 'Xxehan',
    resources: 1, influence: 1, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 32,
  },
  // Tile 33
  'corneeq': {
    id: 'corneeq', name: 'Corneeq',
    resources: 1, influence: 2, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 33,
  },
  'resculon': {
    id: 'resculon', name: 'Resculon',
    resources: 2, influence: 0, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 33,
  },
  // Tile 34
  'centauri': {
    id: 'centauri', name: 'Centauri',
    resources: 1, influence: 3, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 34,
  },
  'gral': {
    id: 'gral', name: 'Gral',
    resources: 1, influence: 1, trait: 'industrial',
    techSpecialty: 'yellow', legendary: false, systemId: 34,
  },
  // Tile 35
  'bereg': {
    id: 'bereg', name: 'Bereg',
    resources: 3, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 35,
  },
  'lirta-iv': {
    id: 'lirta-iv', name: 'Lirta IV',
    resources: 2, influence: 3, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 35,
  },
  // Tile 36
  'arnor': {
    id: 'arnor', name: 'Arnor',
    resources: 2, influence: 1, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 36,
  },
  'lor': {
    id: 'lor', name: 'Lor',
    resources: 1, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 36,
  },
  // Tile 37
  'arinam': {
    id: 'arinam', name: 'Arinam',
    resources: 1, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 37,
  },
  'meer': {
    id: 'meer', name: 'Meer',
    resources: 0, influence: 4, trait: 'hazardous',
    techSpecialty: 'red', legendary: false, systemId: 37,
  },
  // Tile 38
  'abyz': {
    id: 'abyz', name: 'Abyz',
    resources: 3, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 38,
  },
  'fria': {
    id: 'fria', name: 'Fria',
    resources: 2, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 38,
  },

  // ============================================================
  // Blue Tiles — PoK Single Planet
  // ============================================================

  // Tile 59
  'archon-vail': {
    id: 'archon-vail', name: 'Archon Vail',
    resources: 1, influence: 3, trait: 'hazardous',
    techSpecialty: 'blue', legendary: false, systemId: 59,
  },
  // Tile 60
  'perimeter': {
    id: 'perimeter', name: 'Perimeter',
    resources: 2, influence: 1, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 60,
  },
  // Tile 61
  'ang': {
    id: 'ang', name: 'Ang',
    resources: 2, influence: 0, trait: 'industrial',
    techSpecialty: 'red', legendary: false, systemId: 61,
  },
  // Tile 62
  'sem-lore': {
    id: 'sem-lore', name: 'Sem-Lore',
    resources: 3, influence: 2, trait: 'cultural',
    techSpecialty: 'yellow', legendary: false, systemId: 62,
  },
  // Tile 63
  'vorhal': {
    id: 'vorhal', name: 'Vorhal',
    resources: 0, influence: 2, trait: 'cultural',
    techSpecialty: 'green', legendary: false, systemId: 63,
  },
  // Tile 64
  'atlas': {
    id: 'atlas', name: 'Atlas',
    resources: 3, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 64,
  },
  // Tile 65 — Legendary
  'primor': {
    id: 'primor', name: 'Primor',
    resources: 2, influence: 1, trait: 'cultural',
    techSpecialty: 'green', legendary: true, systemId: 65,
  },
  // Tile 66 — Legendary
  'hopes-end': {
    id: 'hopes-end', name: "Hope's End",
    resources: 3, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: true, systemId: 66,
  },

  // ============================================================
  // Red Tiles with Planets — PoK
  // ============================================================

  // Tile 67 — Gravity Rift
  'cormund': {
    id: 'cormund', name: 'Cormund',
    resources: 2, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 67,
  },
  // Tile 68 — Nebula
  'everra': {
    id: 'everra', name: 'Everra',
    resources: 3, influence: 1, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 68,
  },

  // ============================================================
  // Blue Tiles — PoK Two Planets
  // ============================================================

  // Tile 69
  'accoen': {
    id: 'accoen', name: 'Accoen',
    resources: 2, influence: 3, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 69,
  },
  'jeol-ir': {
    id: 'jeol-ir', name: 'Jeol Ir',
    resources: 2, influence: 3, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 69,
  },
  // Tile 70
  'kraag': {
    id: 'kraag', name: 'Kraag',
    resources: 2, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 70,
  },
  'siig': {
    id: 'siig', name: 'Siig',
    resources: 0, influence: 2, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 70,
  },
  // Tile 71
  'bakal': {
    id: 'bakal', name: "Ba'Kal",
    resources: 3, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 71,
  },
  'alio-prima': {
    id: 'alio-prima', name: 'Alio Prima',
    resources: 1, influence: 1, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 71,
  },
  // Tile 72
  'lisis': {
    id: 'lisis', name: 'Lisis',
    resources: 2, influence: 2, trait: 'industrial',
    techSpecialty: null, legendary: false, systemId: 72,
  },
  'velnor': {
    id: 'velnor', name: 'Velnor',
    resources: 2, influence: 1, trait: 'industrial',
    techSpecialty: 'red', legendary: false, systemId: 72,
  },
  // Tile 73
  'cealdri': {
    id: 'cealdri', name: 'Cealdri',
    resources: 0, influence: 2, trait: 'cultural',
    techSpecialty: 'yellow', legendary: false, systemId: 73,
  },
  'xanhact': {
    id: 'xanhact', name: 'Xanhact',
    resources: 0, influence: 1, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 73,
  },
  // Tile 74
  'vega-major': {
    id: 'vega-major', name: 'Vega Major',
    resources: 2, influence: 1, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 74,
  },
  'vega-minor': {
    id: 'vega-minor', name: 'Vega Minor',
    resources: 1, influence: 2, trait: 'cultural',
    techSpecialty: 'blue', legendary: false, systemId: 74,
  },

  // ============================================================
  // Blue Tiles — PoK Three Planets
  // ============================================================

  // Tile 75
  'loki': {
    id: 'loki', name: 'Loki',
    resources: 1, influence: 2, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 75,
  },
  'abaddon': {
    id: 'abaddon', name: 'Abaddon',
    resources: 1, influence: 0, trait: 'cultural',
    techSpecialty: null, legendary: false, systemId: 75,
  },
  'ashtroth': {
    id: 'ashtroth', name: 'Ashtroth',
    resources: 2, influence: 0, trait: 'hazardous',
    techSpecialty: null, legendary: false, systemId: 75,
  },
  // Tile 76
  'rigel-i': {
    id: 'rigel-i', name: 'Rigel I',
    resources: 0, influence: 1, trait: 'hazardous',
    techSpecialty: 'green', legendary: false, systemId: 76,
  },
  'rigel-ii': {
    id: 'rigel-ii', name: 'Rigel II',
    resources: 1, influence: 2, trait: 'industrial',
    techSpecialty: 'blue', legendary: false, systemId: 76,
  },
  'rigel-iii': {
    id: 'rigel-iii', name: 'Rigel III',
    resources: 1, influence: 1, trait: 'industrial',
    techSpecialty: 'green', legendary: false, systemId: 76,
  },

  // ============================================================
  // Wormhole Nexus — PoK (Tile 82)
  // ============================================================
  'mallice': {
    id: 'mallice', name: 'Mallice',
    resources: 0, influence: 3, trait: 'cultural',
    techSpecialty: 'yellow', legendary: true, systemId: 82,
  },
}

function getPlanet(id) {
  return planets[id]
}

function getAllPlanets() {
  return Object.values(planets)
}

function getPlanetsBySystem(systemId) {
  return Object.values(planets).filter(p => p.systemId === systemId)
}

function getPlanetsByTrait(trait) {
  return Object.values(planets).filter(p => p.trait === trait)
}

module.exports = {
  planets,
  getPlanet,
  getAllPlanets,
  getPlanetsBySystem,
  getPlanetsByTrait,
}
